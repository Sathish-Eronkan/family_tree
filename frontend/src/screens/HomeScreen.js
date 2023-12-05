import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
const CreateScreen = () => {

  const [command, setCommand] = useState('');
  const [showTree, setShowTree] = useState(false);
  const [textData, setTextData] = useState('');
  const [textLength, setTextLength] = useState(0);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      let commands = command.split('\n');
      console.log('commands ',commands);
      for(let i=0; i< commands.length; i++) {
        let eachCommand = commands[i];
        console.log('eachCommand ',eachCommand);
        if(eachCommand.includes('show_tree')) {
          const {data} = await axios.get('/api/result');
          console.log('data ',data);
          setTextData(data.textValue);
          setShowTree(true);
          setTextLength(data.textLength);
        } else {
          console.log('inside else ',eachCommand);
          const {data} = await axios.post('/api/command',{
            command: eachCommand
          });
          if(data.message.includes('not')) {
            toast.error(data.message);
          } else {
            toast.success(data.message);
          }
          setCommand('');
          setTextData('');
          setShowTree(false);
        }
      }
    } catch (err) {
       toast.error(err?.data?.message || err.error);
    }
  };

  const resetHandler = async () => {
    await axios.get('/api/reset');
    setCommand('');
    setShowTree(false);
    setTextData('');
    setTextLength(0);
    toast.success('Reset is done');
  } 

  return (
    <FormContainer>
        <h1>Set Command</h1>
        <Form onSubmit={submitHandler}>
            {showTree ? (
              <div>
                <Form.Group className='my-2' controlId='command'>
                  <Form.Label>Command</Form.Label>
                  <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder='Enter Command'
                      value={command}
                      required
                      onChange={(e) => setCommand(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group className='my-2' controlId="textArea">
                        <Form.Label>Family Tree:</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={textLength}
                          value={textData} 
                          readOnly 
                        />
                </Form.Group>
              </div>
            ) : (
              <Form.Group className='my-2' controlId='command'>
                <Form.Label>Command</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder='Enter Command'
                    value={command}
                    required
                    onChange={(e) => setCommand(e.target.value)}
                ></Form.Control>
              </Form.Group>
            )}

            <div className="my-2">
              <Button type='submit' style={{ marginRight: '10px' }} variant='primary'>
                Submit
              </Button>
              <Button type='button' variant='primary' style={{ marginRight: '10px' }} onClick={resetHandler}>
                Clear
              </Button>              
            </div>
        </Form>
    </FormContainer>
  ) 
};

export default CreateScreen;

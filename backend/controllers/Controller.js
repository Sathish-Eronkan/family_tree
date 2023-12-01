import {setPerson, setRelationship, getValues, resetData} from '../utils/utils.js';
const getResult = async (req, res) => {
    try {
        let result = await getValues();
        console.log('result from getResult ',result);
        res.status(200).json({
          textValue: result.textValue,
          textLength: result.textLength
        });
    } catch (err) {
        console.log('Error setting values:',err);
    }
}

const setValues = async (req,res) => {
  try {
        let message = '';
        let command = req.body.command;
        if(command.includes('create_person')) {
          message = await setPerson(command);
        } else {
          message = await setRelationship(command);
        }
        console.log('message ',message);
        res.status(200).json({
          message
        });
    } catch (err) {
        console.log('Error setting result:',err);
    }
}

const clearData = async (req,res) => {
    try {
        await resetData();
        res.status(200).json({
          success: true,
          message: 'Reset is Done'
        });
    } catch (err) {
        console.log('Error reset:',err);
    }
}

export {setValues, getResult, clearData};
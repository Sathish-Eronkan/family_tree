import redis from 'redis';

const setPerson = async (command) => {
    try {
        const client = redis.createClient();
        client.on('error', err => console.log('Redis Client Error', err));
        await client.connect();
        if(process.env.clear === 'true') {
            await resetData();
            process.env.clear = false;
        }
        const words = command.split(' ');

        const name = `${words[1]} ${words[2]}`;
        const gender = `${words[3]}`;

        let initialResult = await client.get('family');
        initialResult = initialResult ? JSON.parse(initialResult) : {};

        initialResult[name] = {
            name,
            gender,
            parent: false,
            type: null,
            gap: 0
        }
        console.log('initialResult ',initialResult);
        await client.set('family', JSON.stringify(initialResult));
        client.quit();
        return 'Person Created Successfully';
    } catch (err) {
        console.error('Error setting person:', err);
        client.quit();
    }
}

const setRelationship = async (command) => {
    try {
        const client = redis.createClient();
        client.on('error', err => console.log('Redis Client Error', err));
        await client.connect();
        
        const words = command.split(' ');

        const name1 = `${words[1]} ${words[2]}`;
        const name2 = `${words[3]} ${words[4]}`;

        let initialResult = await client.get('family');
        initialResult = initialResult ? JSON.parse(initialResult) : {};
       
        if(initialResult[name1] && initialResult[name2]) {
            let initialTree = await client.get('tree');
            initialTree = initialTree ? JSON.parse(initialTree) : {};
            initialResult[name2].type = words[0] == 'add_relationship' ? 'son/daughter' : 'sibling/spouse';
            let textLength = initialTree.textLength ? Number(initialTree.textLength) : 0;
            initialTree = initialTree.textValue;
            if(initialTree && (initialResult[name2].parent)) {
                initialTree = `- ${name1} (${initialResult[name1].gender == 'male' ? 'M' : 'F'})` + '\n' + ' ' + initialTree;
                initialResult[name2].parent = false;
                initialResult[name1].parent = true;

                initialResult[name1].type = 'parent';                
                for (let key in initialResult) {
                    if(key != name1) {
                        initialResult[name2].gap += 2;
                    }
                }
                textLength++;
            } else if(initialTree) {
                let prevValue = await client.get('prevValue');
                prevValue = JSON.parse(prevValue);
                console.log('prevValue ',prevValue);
                initialTree += '\n';
                let value = `- ${name2} (${initialResult[name2].gender == 'male' ? 'M' : 'F'})`;
                if(prevValue.type == initialResult[name2].type) {
                    let gapValue = initialResult[name1].gap + 2;
                    initialResult[name2].gap = gapValue;
                    while (gapValue > 0) {
                        value = ' ' + value;
                        gapValue--;
                    }
                    initialTree += value;
                    prevValue.gap = gapValue;
                    await client.set('prevValue', JSON.stringify(prevValue));
                } else {
                    let gapValue = Number(prevValue.gap) + 2;
                    initialResult[name2].gap = gapValue;
                    while (gapValue > 0) {
                        value = ' ' + value;
                        gapValue--;
                    }
                    initialTree += value;
                }
                textLength++;
            } else {
                initialTree = `- ${name1} (${initialResult[name1].gender == 'male' ? 'M' : 'F'})`;
                initialTree += '\n';
                initialTree += `  - ${name2} (${initialResult[name2].gender == 'male' ? 'M' : 'F'})`;
                textLength += 2;
                initialResult[name1].parent = true;
                initialResult[name1].type = 'parent';
                initialResult[name2].gap = 2;

                await client.set('prevValue', JSON.stringify({
                    type: initialResult[name2].type,
                    gap: initialResult[name2].gap
                }));
            }
            console.log(initialTree);
            await client.set('tree', JSON.stringify({
                textValue: initialTree,
                textLength
            }));
            await client.set('family',JSON.stringify(initialResult));
        } else {
            if(!initialResult[name1])
                return `${name1} is not created yet`;
            else 
                return `${name2} is not created yet`;
        }
        client.quit();
        return 'Added Relationship Successfully';
    } catch (err) {
        console.error('Error setting person:', err);
        client.quit();
    }
}

const resetData = async () => {
    const client = redis.createClient();
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
    await client.del('family');
    await client.del('tree');
    await client.del('prevValue');
    console.log('delete successfully')
    client.quit();
}

const getValues = async() => {
    const client = redis.createClient();
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
    let data = await client.get('tree');
    data = JSON.parse(data);
    return data;
}

export {setPerson, setRelationship, resetData, getValues}
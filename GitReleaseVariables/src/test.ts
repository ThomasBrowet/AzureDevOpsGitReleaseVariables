
import * as processJson from './processJson';
import * as file from './File';

var input_fileName = "sample.json";
async function Run()
{
    console.log("Converting the JSON file to variables");
    var validInputs:boolean=true;
    try{

        if(validInputs)
        {
            var obCont:any = JSON.parse(await file.OpenFile(input_fileName));
            var result:boolean =  await processJson.ProcessKeys(obCont);
        }
        else{
            console.log("fail");
        }
    }
    catch(err)
    {
        console.log(err);
    }
}

Run();
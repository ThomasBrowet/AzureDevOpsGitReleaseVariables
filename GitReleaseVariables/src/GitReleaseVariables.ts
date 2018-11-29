import * as tl from 'azure-pipelines-task-lib';
import * as processJson from './processJson';
import * as file from './File';

var validInputs: boolean = false;
var input_fileName: string = "";

function validateInputs() {
    //File name input
    tl.debug("validating inputs...");

    validInputs = true;
    try {
        input_fileName = tl.getInput('jsonFile', true);
    }
    catch (ex) {
        tl.error("a filename is a required input to this task, but was not supplied");
        validInputs = false;
    }
}

async function Run() {
    console.log("Inject Build/Release variables from a Json file stored in a git Repo.");
    validateInputs();
    try {
        if (validInputs) {
            var contentObj: any = await getFileJSONData();
            await processJson.ProcessKeys(contentObj);
        }
        else {
            tl.setResult(tl.TaskResult.Failed, "Invalid Inputs");
        }
    }
    catch (err) {
        tl.error(err);
        tl.setResult(tl.TaskResult.Failed, "processing JSON failed");
    }
}

async function getFileJSONData(): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
        try {
            var retryCount: number = 0;
            var success: boolean = false;
            var jsonErr: any;
            var contentObj: any;
            while (!((retryCount >= 4) || success)) {
                try {

                    contentObj = JSON.parse(await file.OpenFile(input_fileName));
                    success = true;
                }
                catch (err) {
                    jsonErr = err;
                    retryCount++;
                    tl.debug("error reading json: " + err.toString());
                    tl.debug("retry count: " + retryCount.toString());
                }

            }
            if (success) {
                resolve(contentObj)
            }
            else {
                reject(jsonErr);
            }
        }
        catch (outsideError) {
            tl.debug("error in JSON read process " + outsideError.toString());
            reject(outsideError);
        }
    });
}

//main
try {
    Run();
}
catch (err) {
    tl.setResult(tl.TaskResult.Failed, "Unable to process JSON successfully for variables.");
}



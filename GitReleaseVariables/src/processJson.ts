import * as tl from 'azure-pipelines-task-lib';

export async function ProcessKeys(jsonData: any): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
        for (var key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                var value = jsonData[key];
                console.log("Setting variable : " + key);
                tl.setVariable(key, value, false);
            }
        }
    });
}
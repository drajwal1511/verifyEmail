var emailExistence = require('email-existence');
const csv = require("csv-parser");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fstream = require("fs");
const fileData = [];
fstream.createReadStream('100.csv')
    .pipe(csv())
    .on('data', (data) => {
        var name = Object.entries(data)[0][1];
        var email = String(Object.entries(data)[1][1]);
        fileData.push([name, email]);
    })
    .on('end', () => {
        console.log("EOF");
    })
    .on('close', () => {
        console.log("Closed input file");
        (async () => {
            const csvWriter = createCsvWriter({
                path: 'Email_Results.csv',
                header: [
                    { id: 'name', title: 'name' },
                    { id: 'email', title: 'email' },
                    { id: 'result', title: 'result' }
                ]
            });
            var results = [];
            for (var i = 0; i < fileData.length; i++) {
                await emailExistence.check(fileData[i][1], (err, res) => {
                    if (err) {
                        results.push({ name: fileData[i][0], email: fileData[i][1], result: 'Not possible for this Email' });
                    } else {
                        console.log(res);
                        if (res) {
                            results.push({ name: fileData[i][0], email: fileData[i][1], result: 'Success' });
                        } else {
                            results.push({ name: fileData[i][0], email: fileData[i][1], result: 'Bad' });
                        }
                    }
                })
            }
            csvWriter.writeRecords(results)
                .then(() => {
                    console.log("Done Writing");
                })
        })();
    })
// console.log(fileDataObj);
// csvWriter.writeRecords(fileData)
//     .then(()=>{
//         console.log("Done");
//     })
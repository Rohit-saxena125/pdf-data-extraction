const express = require("express");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const pdfparse = require("pdf-parse");
const app = express();
app.use("/", express.static("public"));
app.use(fileUpload());
app.post("/extract-text", (req, res) => {
  if (req.files.pdfFile === null) {
    return res.status(400).send("No file uploaded");
  }
  const file = req.files.pdfFile;
  pdfparse(file).then(
    (result) => {
      
      // result.text send raw text
      fs.writeFileSync("public/text.txt", result.text);
      fs.readFile("public/text.txt", "utf8", (err, data) => {
        if (err) throw err;
        var lines = data.split("\n");
        let newText = "";
        let pay= "";
        for (var i = 0; i < lines.length; i++) 
        {
          if ((lines[i].match(/\d{2}-\d{2}-\d{4}/g) ||lines[i].match(/(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?),+(\d{1,2}),+(\d{4})/g)||lines[i].match(/\d{2}\/\d{2}\/\d{4}/g))||(lines[i].match(/\d{2}-\d{1}-\d{4}/g)||lines[i].match(/\d{2}\/\d{1}\/\d{4}/g)))
          {
            newText += lines[i] + "\n";  
          } 
        }
        fs.appendFileSync("public/text.txt", newText);
        for(var j=0;j<lines.length;j++)
        {
            if(lines[j].match(/paid/g)||lines[j].match(/recieved/g)||lines[j].match(/donated/g)||lines[j].match(/debited/g)||lines[j].match(/credited/g))
            {
                pay +=lines[j] + "\n";
            }
        }
        fs.appendFileSync("public/payment.txt", pay);


            console.log(newText); 
            console.log(pay);
            res.send("Date"+"\n"+newText+"\n"+"Payments"+"\n"+pay);
            
      }); //.then()     //delete file
    }
  );
});
app.listen(4000);
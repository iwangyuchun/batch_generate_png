const fs = require('fs');

const setting = {
    sourceDir: './data'
}

function main() {
    const allDirs = fs.readdirSync(setting.sourceDir);
    if (allDirs.length <= 0) {
        return
    }
    
    const titleStr=allDirs.reduce((pre,cur)=>{
        return pre+`<th scope="col">${cur}</th>\r\n`
    },'');
    const dataArray=[];
    for(let i=0;i<allDirs.length;i++){
        const subDir = fs.readdirSync(setting.sourceDir + "/" + allDirs[i]);
        dataArray[i]=subDir;
    }
    let bodyStr=''
    for(let i=0;i<dataArray[0].length;i++){
        bodyStr+=`<tr>
        <th scope="row">${dataArray[0][i]}</th>`
        for(let j=0;j<dataArray.length;j++){
            if(dataArray[j][i]){
                bodyStr+=`<td><img src="${allDirs[j]}/${dataArray[j][i]}/picture.png" width="400px" height="400px" /></td>`
            }
        }
        bodyStr+=`</tr>`
    }
    const tempFile=fs.readFileSync('./index.html').toString().replace("<!--headpoint-->",titleStr).replace("<!--bodypoint-->",bodyStr);
    fs.writeFileSync("./views/index.html",tempFile);
}


main()
const fs = require('fs');
const csvtojson = require('csvtojson');
const { createCanvas } = require('canvas');

const setting = {
    fileDir: './data',
    targetDir: './data/',
    width: 1000,
    height: 1000,
    lineWidth: 2,
    lineColor: 'rgba(150,150,150,1)',
    circleRadius: 5,
    isFill: true,
    fillColor: 'rgba(255,255,255,1)',
    isStroke: true,
    strokeWidth: 3,
    strokeColor: 'rgba(70,130,180,1)',

}

function getMinMax(nodes) {
    let maxX = -Infinity;
    let minX = Infinity;
    let maxY = -Infinity;
    let minY = Infinity;
    nodes.forEach(node => {
        if (node['positionx'] > maxX) {
            maxX = node['positionx'];
        }
        if (node['positionx'] < minX) {
            minX = node['positionx'];
        }
        if (node['positiony'] > maxY) {
            maxY = node['positiony'];
        }
        if (node['positiony'] < minY) {
            minY = node['positiony'];
        }
    });
    return {
        maxX,
        maxY,
        minY,
        minX,
    }
}

function scaleLinear(domain, range) {
    return function (val) {
        //(y-y2)/(y1-y2)=(x-x2)/(x1-x2)
        if (domain[0] == domain[1] || range[0] == range[1]) {
            throw new Error('domain or range illagel');
        }
        return (val - domain[1]) / (domain[0] - domain[1]) * (range[0] - range[1]) + range[1];
    }
}

async function main() {

    const canvas = createCanvas(setting.width, setting.height);
    const ctx = canvas.getContext("2d");

    const parentDirs = fs.readdirSync(setting.fileDir);
    for (let m = 0; m < parentDirs.length; m++) {
        const allDirs = fs.readdirSync(`${setting.fileDir}/${parentDirs[m]}`);
        for (let i = 0; i < allDirs.length; i++) {

            const links = await csvtojson().fromFile(`${setting.fileDir}/${parentDirs[m]}/${allDirs[i]}/links.csv`);
            const nodes = await csvtojson().fromFile(`${setting.fileDir}/${parentDirs[m]}/${allDirs[i]}/nodes.csv`);
            nodes.forEach(node => {
                node['positionx'] = parseFloat(node['positionx']);
                node['positiony'] = parseFloat(node['positiony']);
            });
            const { minX, minY, maxX, maxY } = getMinMax(nodes);

            const xScale = scaleLinear([minX, maxX], [5, setting.width - 5]);
            const yScale = scaleLinear([minY, maxY], [5, setting.height - 5]);
            nodes.forEach(node => {
                node['positionx'] = xScale(parseFloat(node['positionx']));
                node['positiony'] = yScale(parseFloat(node['positiony']));
            });
            ctx.clearRect(0, 0, setting.width, setting.height);
            ctx.beginPath();
            ctx.lineWidth = setting.lineWidth;
            ctx.strokeStyle = setting.lineColor;
            links.forEach(link => {
                ctx.moveTo(nodes[parseInt(link['source'])]['positionx'], nodes[parseInt(link['source'])]['positiony']);
                ctx.lineTo(nodes[parseInt(link['target'])]['positionx'], nodes[parseInt(link['target'])]['positiony'])
            });
            ctx.stroke();


            ctx.fillStyle = setting.fillColor;
            ctx.lineWidth = setting.strokeWidth;
            ctx.strokeStyle = setting.strokeColor;
            nodes.forEach(node => {
                ctx.beginPath();
                ctx.arc(node['positionx'], node['positiony'], setting.circleRadius, 0, Math.PI * 2, true);
                if (setting.isFill) {
                    ctx.fill();
                    ctx.stroke();
                } else {
                    ctx.stroke();
                }
            });

            fs.writeFileSync(setting.targetDir +parentDirs[m]+"/"+ allDirs[i]+"/picture" + '.png', canvas.toBuffer("image/png"));
        }
    }


}

main()
const fs = require('fs');

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace "Use<span className='text-blue-600'>.ai</span>"
    content = content.replace(/Use<span className='text-blue-600'>\.ai<\/span>/g, "Use<span className='text-blue-600'>Converra<\/span>");
    
    // Replace "Use<span className=\"text-blue-600\">.ai</span>"
    content = content.replace(/Use<span className="text-blue-600">\.ai<\/span>/g, "Use<span className=\"text-blue-600\">Converra<\/span>");

    // Replace "Use<span className='text-zinc-400'>AI</span>"
    content = content.replace(/Use<span className='text-zinc-400'>AI<\/span>/g, "Use<span className='text-zinc-400'>Converra<\/span>");

    // Replace "Use.ai"
    content = content.replace(/Use\.ai/g, "UseConverra");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Renamed in: " + filePath);
}

replaceInFile('src/components/HomeClient.tsx');
replaceInFile('src/components/EmbedClient.tsx');
replaceInFile('src/components/RoadmapClient.tsx');
replaceInFile('src/components/ui/hero-1.tsx');
replaceInFile('src/app/loading.tsx');


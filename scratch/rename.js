const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace "UseAI" with "UseConverra"
    // Also "Use AI" with "Use Converra"
    // Also "useai" with "useconverra"
    // Also "use ai" with "use converra"
    
    content = content.replace(/UseAI/g, 'UseConverra');
    content = content.replace(/Use AI/g, 'Use Converra');
    content = content.replace(/useai/g, 'useconverra');
    content = content.replace(/use ai/g, 'use converra');
    
    // Handle the specific JSX span in DashboardClient:
    // Use <span className='text-zinc-400'>AI</span> -> Use <span className='text-zinc-400'>Converra</span>
    content = content.replace(/Use <span className='text-zinc-400'>AI<\/span>/g, "Use <span className='text-zinc-400'>Converra</span>");
    content = content.replace(/Use <span className="text-zinc-400">AI<\/span>/g, "Use <span className=\"text-zinc-400\">Converra</span>");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Renamed in: " + filePath);
}

replaceInFile('src/components/HomeClient.tsx');
replaceInFile('src/components/RoadmapClient.tsx');
replaceInFile('src/components/DashboardClient.tsx');
replaceInFile('src/app/dashboard/crm/chat/page.tsx');

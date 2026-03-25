const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function findFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, filesList);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      filesList.push(filePath);
    }
  }
  return filesList;
}

const allFiles = findFiles(srcDir);

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace import
  if (content.includes('import { useToast } from "@/shared/hooks/use-toast"')) {
    content = content.replace(
      'import { useToast } from "@/shared/hooks/use-toast";',
      'import { toast } from "sonner";'
    );
    // some might not have semicolon
    content = content.replace(
      'import { useToast } from "@/shared/hooks/use-toast"',
      'import { toast } from "sonner";'
    );
    changed = true;
  }
  
  if (content.includes('import { toast } from "@/shared/hooks/use-toast"')) {
    content = content.replace(
      'import { toast } from "@/shared/hooks/use-toast";',
      'import { toast } from "sonner";'
    );
    content = content.replace(
      'import { toast } from "@/shared/hooks/use-toast"',
      'import { toast } from "sonner";'
    );
    changed = true;
  }
  
  // also handle single quotes
  if (content.includes("import { useToast } from '@/shared/hooks/use-toast'")) {
      content = content.replace(
          "import { useToast } from '@/shared/hooks/use-toast';",
          'import { toast } from "sonner";'
      );
      changed=true;
  }

  // Remove `const { toast } = useToast();`
  if (content.includes('const { toast } = useToast();')) {
    content = content.replace(/const\s+\{\s*toast\s*\}\s*=\s*useToast\(\)\s*;/g, '');
    changed = true;
  }

  // Replace `toast({ title: ..., description: ..., variant: "destructive" })`
  // with `toast.error(title, { description })`

  // Let's do a simple regex replacement for the 3 main variants
  // It's safer to just do a string replacement for the object if possible, 
  // but let's use a regex to match the `toast({ ... })` pattern and rewrite it.

  if(changed) {
     // A simple naive AST-less replace for the standard format we saw:
     let matches = Array.from(content.matchAll(/toast\(\s*\{([\s\S]*?)\}\s*\)/g));
     for(let match of matches) {
        let inside = match[1];
        let titleMatch = inside.match(/title:\s*([^,]+)/);
        let descMatch = inside.match(/description:\s*([^,]+)/);
        let variantMatch = inside.match(/variant:\s*([^,]+)/);
        
        let title = titleMatch ? titleMatch[1].trim() : '"Notification"';
        let desc = descMatch ? descMatch[1].trim() : undefined;
        let variant = variantMatch ? variantMatch[1].trim() : undefined;

        let options = [];
        if(desc) options.push(`description: ${desc}`);
        let optionsStr = options.length > 0 ? `, { ${options.join(', ')} }` : '';

        let newCall = '';
        if(variant === '"destructive"' || variant === "'destructive'") {
            newCall = `toast.error(${title}${optionsStr})`;
        } else if (variant === '"success"' || variant === "'success'") {
            newCall = `toast.success(${title}${optionsStr})`;
        } else {
            newCall = `toast(${title}${optionsStr})`;
        }
        
        content = content.replace(match[0], newCall);
     }
     
     fs.writeFileSync(file, content, 'utf8');
     console.log(`Updated ${file}`);
  }
}

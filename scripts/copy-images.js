const fs = require('fs');
const path = require('path');

// 파일 복사 함수
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// imge 폴더를 out/imge로 복사
const imgeSourceDir = path.join(__dirname, '..', 'imge');
const imgeDestDir = path.join(__dirname, '..', 'out', 'imge');

if (fs.existsSync(imgeSourceDir)) {
  if (!fs.existsSync(imgeDestDir)) {
    fs.mkdirSync(imgeDestDir, { recursive: true });
  }
  copyRecursiveSync(imgeSourceDir, imgeDestDir);
  console.log('✓ Images copied to out/imge');
} else {
  console.log('⚠ imge folder not found');
}

// public 폴더의 모든 파일을 out으로 복사 (Next.js가 자동으로 복사하지 않는 경우 대비)
const publicSourceDir = path.join(__dirname, '..', 'public');
const publicDestDir = path.join(__dirname, '..', 'out');

if (fs.existsSync(publicSourceDir)) {
  const publicFiles = fs.readdirSync(publicSourceDir).filter(f => f !== '.gitkeep');
  if (publicFiles.length > 0) {
    console.log(`Found ${publicFiles.length} file(s) in public folder:`, publicFiles.join(', '));
    // public 폴더의 각 파일/폴더를 out으로 복사
    publicFiles.forEach(item => {
      const srcPath = path.join(publicSourceDir, item);
      const destPath = path.join(publicDestDir, item);
      copyRecursiveSync(srcPath, destPath);
      console.log(`  ✓ Copied: ${item}`);
    });
    console.log('✓ Public files (icons, etc.) copied to out/');
  } else {
    console.log('⚠ public folder is empty (only .gitkeep)');
  }
} else {
  console.log('⚠ public folder not found');
}


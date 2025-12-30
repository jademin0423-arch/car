const fs = require('fs');
const path = require('path');

// imge 폴더를 out/imge로 복사
const sourceDir = path.join(__dirname, '..', 'imge');
const destDir = path.join(__dirname, '..', 'out', 'imge');

if (fs.existsSync(sourceDir)) {
  // 목적지 디렉토리 생성
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

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

  copyRecursiveSync(sourceDir, destDir);
  console.log('✓ Images copied to out/imge');
} else {
  console.log('⚠ imge folder not found');
}


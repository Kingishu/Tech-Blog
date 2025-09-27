const fs = require('fs');
const path = require('path');

// 文章目录
const articleDir = './article';

// 移除返回博客链接的正则表达式
const backLinkPattern = /<a href="\.\.\/index\.html" class="back-to-blog">\s*<span>←<\/span>\s*<span>返回博客<\/span>\s*<\/a>\s*/g;

// 移除相关CSS样式的正则表达式
const backLinkStylePattern = /\.back-to-blog\s*{[^}]*}\s*/g;

// 处理单个文件
function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // 移除返回博客链接
        content = content.replace(backLinkPattern, '');

        // 移除相关的CSS样式
        content = content.replace(backLinkStylePattern, '');

        // 写回文件
        fs.writeFileSync(filePath, content, 'utf8');

        console.log(`✅ 已处理: ${path.basename(filePath)}`);
        return true;
    } catch (error) {
        console.error(`❌ 处理失败 ${path.basename(filePath)}:`, error.message);
        return false;
    }
}

// 处理所有文章文件
function processAllFiles() {
    console.log('🔄 开始移除所有文章中的返回博客链接...\n');

    // 读取所有HTML文件
    const files = fs.readdirSync(articleDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));

    if (htmlFiles.length === 0) {
        console.log('📄 没有找到HTML文件');
        return;
    }

    console.log(`📄 找到 ${htmlFiles.length} 个文章文件:\n`);

    // 处理每个文件
    const results = [];
    htmlFiles.forEach(file => {
        const filePath = path.join(articleDir, file);
        const result = processFile(filePath);
        results.push({ file, success: result });
    });

    // 输出结果
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log('\n📊 处理结果:');
    console.log(`✅ 成功: ${successful.length} 个文件`);
    console.log(`❌ 失败: ${failed.length} 个文件`);

    if (failed.length > 0) {
        console.log('\n❌ 处理失败的文件:');
        failed.forEach(result => {
            console.log(`   - ${result.file}`);
        });
    }

    console.log('\n🎉 所有文章中的返回博客链接已移除！');
}

// 主函数
function main() {
    console.log('========================================');
    console.log('      移除文章返回博客链接工具');
    console.log('========================================\n');

    processAllFiles();
}

// 运行主函数
if (require.main === module) {
    main();
}

module.exports = {
    processFile,
    processAllFiles
};
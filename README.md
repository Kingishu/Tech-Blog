# 个人博客

## 主要功能
实现了首页、作品页、文章页、关于页、联系页面。

## 作品页面
作品页面需要在JS中手动添加：
1. 使用Ctrl+F查找"worksDatabase"
2. 在该数组中按照规范手动添加作品信息

## 文章页面
文章页面是高度自动化的，只需执行以下步骤：
1. 将Markdown文档上传到`md-articles`文件夹中
2. 运行`md-to-article.js`脚本，实现自动化部署

### 注意事项
Markdown文档需要包含以下标头信息：

```yaml
title: "前端开发入门指南"        # 文章标题
category: "前端开发"             # 文章的大目录分类
section: "JavaScript基础"        # 文章的小目录分类
author: "Kingishu"               # 作者名字
description: "为初学者提供的前端开发入门指南，涵盖HTML、CSS、JavaScript基础知识"  # 文章描述（用于卡片页面）
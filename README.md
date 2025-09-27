# 个人博客
## 主要功能
实现了首页,作品页,文章页,关于页,联系页面文章
## 作品页面
作品页面需要在js中手动添加,ctrl+F查找"worksDatabase"
在该数组中按照规范,手动添加.
## 文章页面
文章页面是高度自动化的,我们只需要上传我们的md文档在md-articles文件夹当中,执行md-to-article.js即可实现自动化部署,将md文档转换为文章,并且添加在网页当中.  
有一下注意事项,我们的md文档需要有标头

title: "前端开发入门指南"       这是文章的title,不需要过多赘述  
category: "前端开发"           这是文章目录的大目录  
section: "JavaScript基础"      这是文章的小目录  
author: "Kingishu"             这是作者名字  
description: "为初学者提供的前端开发入门指南，涵盖HTML、CSS、JavaScript基础知识" 
这是卡片页面的描述   

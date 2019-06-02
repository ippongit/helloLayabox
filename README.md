# helloLayabox
这是《了不起的 LayaBox：HTML5 游戏开发指南》配套的工程文件

---
勘误修正：

---

### 问题：Cannot read property 'createTexture' of null
### 发现日期：2019-06-02
### 详细描述：
LayaAir IDE 2.1.0版本以后取消使用Canvas API后WebGL类，类库版本大于2.0.1的项目如果编辑模式下在类库选择中Webgl，可能会出现错误提示：“Cannot read property 'createTexture' of null”；解决方法是取消选择webgl库

---

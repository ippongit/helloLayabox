---

### 勘误修正：
反馈邮箱：116796544@qq.com

---

#### 问题：Cannot read property 'createTexture' of null
#### 发现日期：2019-06-02
#### 详细描述：
LayaAir IDE 2.1.0版本以后取消使用原生的Canvas API，WebGL类也因此被取消。类库版本大于2.0.1的项目如果编辑模式下在类库选择了WebGL，项目运行时可能会出现错误提示：“Cannot read property 'createTexture' of null”；解决方法是取消选择WebGL库。

---

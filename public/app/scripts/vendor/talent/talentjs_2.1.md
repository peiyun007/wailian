# TalentJS 2.1 介绍

## 变化
* 框架与业务代码的分离
	* 减少对业务开发的干扰
	* 便于以后的升级
* 命名空间
	* 框架所提供及依赖的类库均放在talent下，包括$和_
* 视图新成员
	* Layout
	* CompositeView
	* ItemView
	* CollectionView

## ItemView
用于简单地渲染一个模板

	MyView = talent.ItemView.extend({
	  template: jst['home/index-page']
	});

	myView = new MyView();
	myView.render();

## CompositeView
包含一个模板和一个可迭代区域，可迭代区域中的每个条目由ItemView来负责渲染

	talent.CompositeView.extend({
		template : jst['common/todo-composite'],
		itemViewContainer : 'ul',
		itemView: talent.ItemView.extend({
			template : talent._.template('<li><%=text%></li>')
		})
	});
	
## Layout
具有若干可局部刷新的区域region

	MyLayout = talent.Layout.extend({
	  template: "#my-layout-template",
	  regions: {
    	menu: "#menu-bar",
	    content: "#main-content"
	  } 
	});

	var myLayout = new MyLayout();
	myLayout.render();
	
	//myMenu在这里可以是ItemView或CompositeView的实例
	myLayout.menu.show(myMenu);
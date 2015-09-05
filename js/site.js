
function slide(root,title,interval){
	var cnt = 0;
	var title = jQuery(title);
	var root = jQuery(root);
	var frm = root.children("*");
	var timeout;

	frm.each(function(k,e){
		jQuery(e).attr("data-slide-index",k);
	});

	function next(new_frm){
		var cur_frm = new_frm === undefined ? frm.eq(cnt % frm.length) : jQuery(new_frm) ;

		cur_frm.removeClass("animated").appendTo(root).addClass("animated");
		jQuery(".present").removeClass("present");
		jQuery("[href=#"+cur_frm.attr('id')+"]").addClass("present");

		title.fadeOut(function(){
			title.text(cur_frm.attr("data-text")).css("color",cur_frm.attr("data-text-color")).attr("href",cur_frm.attr("href")).fadeIn();
			cnt = parseInt(cur_frm.attr("data-slide-index")) + 1;
		});

		clearTimeout(timeout);
		timeout = setTimeout(next,interval);
	}

	next();
	return next;
}

jQuery(function(){
	function hrefClick(self){
		var t = jQuery(self);
		var href = t.attr('href');
		var target = t.attr('target') ? t.attr('target') : "";
		if(href.charAt(0) != "#")
			window.open(href, target);
		else
			window.location.href = href;
	}

	jQuery.get('https://spreadsheets.google.com/feeds/list/1kruLX0f6ytsS4PSH2mkERpXjiJQyIJTKG-hUBE_ivmw/default/public/values?alt=json',function(data){
		var slides = JT2html({
			body:"@{}",
			"":'<img id="@{id}" href="@{href}" data-text-color="@{color}" data-text="@{text}" class="bg fadeIn slide" src="@{img}" alt="">'
		}).fromGSJson(data.feed.entry);
		var slides_ctl = JT2html({ //四小圖
			body:"@{}",
			"":'<div class="column"><img class="size radiu slide-control" href="#@{id}" src="@{img}" alt=""></div>'
		}).fromGSJson(data.feed.entry);
		var bg = jQuery("#bg");
		var ctl = jQuery("#slide-ctl");
		bg.fadeOut(function(){
			bg.empty().append(slides).fadeIn();
			ctl.empty().append(slides_ctl).slideDown();
			var next = slide("#bg","#showoff-text",4000);
			jQuery(".slide-control").click(function(){
				next(jQuery(this).attr('href'));
			});
			jQuery("#showoff-text").click(function(){
				hrefClick(this);
			});
		});
	});

	JT2html({
		body:'@{link}@{list}',
		list:'<a @{addition} class="ui dropdown item"><i class="@{icon} icon"></i>@{text}<div class="menu">@{submenu}@{}</div>@{link}',
		link:'<a href="@{href}" @{addition} class="item"><i class="@{icon} icon"></i>@{text}</a>',
		submenu:'<div class="item"><i class="left dropdown icon"></i><span class="text">@{text}</span><div class="left menu">@{}@{endsubmenu}',
		endsubmenu:'</div></div>@{}',
		"":'<div href="@{href}" class="item" @{addition}>@{text}</div>'
	}).fromGS('https://spreadsheets.google.com/feeds/list/1tMbgsgkR4c2DQNWl6SlEnGnMkpfHTUEbMtOXj4a0Zgw/2/public/values?alt=json',function(html){
		jQuery("#top-menu").empty().append(html).slideDown();
		jQuery('.ui.dropdown').dropdown();
		jQuery(".ui.dropdown div[href]").click(function(){
			hrefClick(this);
		});
	});
});

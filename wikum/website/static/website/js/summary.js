
var discuss_info = null;
var discuss_dict = {};

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function show_hidden_before() {
	$(event.target).prev().toggle();
}

function show_hidden_after() {
	$(event.target).next().toggle();
}

// function expand_summary(did) {
// 	
	// link = event.target;
// 	
	// if ($(link).parent().next().is('#expand_' + comment_strs[0])) {
		// next_com = $(link).parent().next();
	// } else {
		// comment = discuss_dict[did];
		// if (comment.children) {
			// for (var i=0; i<comment.children.length; i++) {
// 				
			// }
		// }
	// }
// 
// }

function get_comment(comment_str, did) {
	
	comment_strs = comment_str.split(/\]\] \[\[/g);
	
	link = event.target;

	if ($(link).next().is('#' + comment_strs[0])) {
		next_com = $(link).next();
		for (var i=0; i<comment_strs.length; i++) {
			next_com.toggle();
			next_com = next_com.next();	
		}
		if (!($(link).next().is(":visible"))) {
			$(event.target).css({'background-color': ''});
		} else {
			$(event.target).css({'background-color': '#ffdb99'});
		}
	} else {
		$(event.target).css({'background-color': '#ffdb99'});
		
		paras = [];
		comments = '';
		
		for (var i=0; i<comment_strs.length; i++) {
			p = comment_strs[i].indexOf('p');
			if (p > -1) {
				comment = parseInt(comment_strs[i].substring(8, p-1));
				comments += comment + ',';
				paras.push(parseInt(comment_strs[i].substring(p+1)));
			} else {
				comment = parseInt(comment_strs[i].substring(8));
				comments += comment + ',';
				paras.push(-1);
			}
		}
		
		comments_list = comments.substring(0,comments.length-1).split(',');
		
		data = [];
		for (var i=0; i<comments_list.length; i++) {
			data.push(discuss_dict[comments_list[i]]);
		}
		

    	var total_text = '';
    	
    	length = data.length;
    	
    	for (var j=0; j<length; j++) {
    		text = '';
    		node = data[j];
    		if (j < length -1) {
    			text += '<div style="margin-bottom: 20px;" class="insert_comment" id="' + comment_strs[j] + '">';
			} else {
	    		text += '<div class="insert_comment" id="' + comment_strs[j] + '">';
	    	}
	    	left = 10;
	    	count = 0;
	    	new_comment = '';
	    	
	    	if (node.replace_node) {
	    		new_comment = '<div class="summary_comment" style="left:' + left + 'px;" id="' + node.d_id + '">';
	    	} else {
	    		new_comment = '<div class="raw_comment" style="left:' + left + 'px;" id="' + node.d_id + '">';
	    	}
	    	
	    	if (paras[j] > -1) {
	    		if (node.replace_node) {
	    			if (node.extra_summary != '') {
	    				t = node.summary + '\n\n' + node.extra_summary;
	    				strs = t.split('\n\n');
	    			} else {
	    				strs = node.summary.split('\n\n');
	    			}
	    		} else {
	    			strs = node.name.split('</p><p>');
	    		}
	    		
	    		if (paras[j] > 0) {
	    			new_comment += '<div style="display: none;" id="hidden_comment_before_' + node.d_id + '_' + paras[j] + '">';
	    			for (var i=0; i<paras[j]; i++) {
	    				new_comment = split_text(strs[i], new_comment, node.d_id);
	    				if (i < paras[j]-1) {
	    					new_comment += '<BR><BR>';
	    				}
	    			}
	    			new_comment += '</div>';
	    			if (paras[j] == 1) {
	    				new_comment += '<a class="see_full_comment btn-xs" onclick="show_hidden_before()">... ( ' +paras[j]+ ' para before )</a><BR>';
	    			} else {
	    				new_comment += '<a class="see_full_comment btn-xs" onclick="show_hidden_before()">... ( ' +paras[j]+ ' paras before )</a><BR>';
	    			}
	    		}
	    		
	    		t = strs[paras[j]].replace(/<[\/]{0,1}(p|P)[^><]*>/g, "");
	    		new_comment = split_text(t, new_comment, node.d_id);
	    	
	    		if (paras[j] < strs.length -1) {
	    			if ((strs.length-paras[j]-1) == 1) {
	    				new_comment += '<BR><a class="see_full_comment btn-xs" onclick="show_hidden_after()">... ( ' +(strs.length-paras[j]-1)+ ' para after )</a>';
	    			} else {
	    				new_comment += '<BR><a class="see_full_comment btn-xs" onclick="show_hidden_after()">... ( ' +(strs.length-paras[j]-1)+ ' paras after )</a>';
	    			}
	    			
	    			new_comment += '<div style="display: none;" id="hidden_comment_after_' + node.d_id + '_' + paras[j] + '">';
	    			for (var i=paras[j]+1; i<strs.length; i++) {
	    				new_comment = split_text(strs[i], new_comment, node.d_id);
	    				if (i < strs.length-1) {
	    					new_comment += '<BR><BR>';
	    				}
	    				
	    			}
	    			new_comment += '</div>';
	    			
	    		}
	    		
	    	} else {
	    		if (node.replace_node) {
	    			if (node.extra_summary != '') {
	    				t = node.summary + '\n<BR><a>...</a><BR>\n' + node.extra_summary;
	    				new_comment = split_text(t, new_comment, node.d_id);
	    			} else {
	    				new_comment = split_text(node.summary, new_comment, node.d_id);
	    			}
	    		} else {
	    			new_comment += node.name;
	    		}
	    		
	    	}
	    	
	    	new_comment += '</div>';
	    	
			text += new_comment;
			
			if (j == length -1) {
				text += '<a class="see_full_comment btn-xs" onclick="toggle_hide(' + length + ');">Hide</a>';
	    	}
	    	
			text += '</div>';
	    	
			total_text += text;
		}
		
		$(link).after(total_text);

	}
}

function toggle_hide(comments) {
	pointer = $(event.target).parent();
	
	for (var i=0; i<comments; i++) {
		pointer.toggle();
		pointer = pointer.prev();
	}
	
	pointer.css({'background-color': ''});
	
}

function split_text(text, summary_text, d_id) {
	var splitted = text.split("\n");
	
	hidden_para_num = text.split("<BR><a>...</a><BR>");
	if (hidden_para_num.length > 1) {
		hidden_para_num = hidden_para_num[1].split('\n\n').length;
	} else {
		hidden_para_num = 0;
	}
	        	
	var hidden = false;
	for (var i=0; i<splitted.length; i++) {
		part = splitted[i];
		
		if (part == '<BR><a>...</a><BR>') {
			summary_text += '</P><a class="see_full_comment btn-xs" onclick="show_div();">... ( ' + hidden_para_num + ' summary points below the fold )</a>';
			summary_text += '<div id="hidden_' + d_id + '" style="display: none; margin-top: 15px;"><P>';
			hidden = true;
		} else {
			var pattern = /\[quote\]/g;
			part = part.replace(pattern, '<blockquote>');
			var pattern = /\[endquote\]/g;
			part = part.replace(pattern, '</blockquote>');
			
			if (part.indexOf('[[') > -1) {
				var comment = part.match(/\[\[(.*)\]\]/);
				var link = comment[1];
				part = part.replace(/\[\[(.*)\]\]/g, "");
				part = '<a onclick="get_comment(\'' + link + '\', ' + d_id + ');">' + part + '</a>';
				summary_text += part;
			} else {
				if (part == '') {
					summary_text += '</P><P>';
				} else {
					summary_text += part + ' ';
				}
			}
		}
	}
	if (hidden) {
		summary_text += '</div>';
	}
	return summary_text;
}

function show_div() {
	$(event.target).next().toggle();
}

function unpack_posts(post) {
	discuss_dict[post.d_id] = post;
	
	if (post.children) {
		for (var i=0; i<post.children.length; i++) {
			unpack_posts(post.children[i]);
		}
	}
	if (post.hid) {
		for (var i=0; i<post.hid.length; i++) {
			unpack_posts(post.hid[i]);
		}
	}
	if (post.replace) {
		for (var i=0; i<post.replace.length; i++) {
			unpack_posts(post.replace[i]);
		}
	}
}

$(document).ready(function () {
	
	var article_url = getParameterByName('article');
	var next = parseInt(getParameterByName('next'));
	if (!next) {
		next = 0;
	}
	
	$.ajax({ 
	    type: 'GET', 
	    url: '/summary_data?article=' + article_url + '&next=' + next, 
	    dataType: 'json',
	    success: function (data) { 
	    	
	    	discuss_info = data.posts.children[0];
	    	
	    	unpack_posts(discuss_info);
	    	
	    	if (discuss_info.replace_node) {
	    		text = discuss_info.summary;
	    	} else {
	    		text = discuss_info.name;
	    	}
	        	
        	extra_text = discuss_info.extra_summary;
        	d_id = discuss_info.d_id;
        	
        	summary_text = '<P>';
        	
        	if (extra_text != '') {
        		text += '\n<BR><a>...</a><BR>\n';
        		text += extra_text;
        	}
        	
        	summary_text = split_text(text, summary_text, d_id);
        
        	summary_text += '</P>';
        	
        	//summary_text += '<span style="float:right;"><a onclick="expand_summary(' + d_id + ');">Expand Summarized Comments</a></span>';

			summary_text += '<BR><hr>';
        	$('#summary').html(summary_text);

	    }
	    
	    
	});
	
	
});
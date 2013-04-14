$(function() {  
	$('#preview').html($('#tarea').val())  ;
	var targetBox1 = $('#tarea'),    tstartSel,     tendSel;
	var focusedelement="none";
	targetBox1.bind('focusout', function() {
	    tstartSel = this.selectionStart;
	    tendSel = this.selectionEnd;		
	});
	$('#tarea').bind('focus', function() {	focusedelement="tarea";});
	$('#tarea').bind('input propertychange', function() {$('#preview').html($('#tarea').val())  ;});
	
	$('#preview').bind('focus', function() {	focusedelement="preview";});
	$('#preview').bind('focusout', function() {	focusedelement="none";});

	$('#preview').live('change', function() {$('#tarea').val($('#preview').html()); });
	
	$('#preview').live('focus', function() {	  before = $(this).html();	})
		.live('blur keyup paste', function() { 	  if (before != $(this).html()) { $(this).trigger('change'); }	});	
	
    $(".tagbtn").click(function() {
        var myValue = $(this).val();
		if(focusedelement=="tarea"){
			insertAt(targetBox1, myValue, tstartSel, tendSel);
			$('#preview').html($('#tarea').val())  ;
		}else{
			pasteHtmlAtCaret(myValue);
			$('#tarea').val($('#preview').html());
		}
    }); 
});

function insertAt(myField, myValue, startSel, endSel) {
    if (startSel || startSel == '0') {
		
        var startPos = startSel;
        var endPos = endSel;
        myField.val(myField.val().substring(0, startPos)+ myValue+ myField.val().substring(endPos, myField.val().length));
  } 
  else {
      myField.val() += myValue;
  }
}


function pasteHtmlAtCaret(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);            
			parentEl = range.commonAncestorContainer;

			if(isWithin("preview",parentEl)){		//paste only on #preview 
				range.deleteContents();
				var el = document.createElement("div");
	            el.innerHTML = html;
	            var frag = document.createDocumentFragment(), node, lastNode;
	            while ( (node = el.firstChild) ) {
	                lastNode = frag.appendChild(node);
	            }
	            range.insertNode(frag);

	            // Preserve the selection
	            if (lastNode) {
	                range = range.cloneRange();
	                range.setStartAfter(lastNode);
	                range.collapse(true);
	                sel.removeAllRanges();
	                sel.addRange(range);
	            }
			}
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}


function isWithin(container,element) {
	rst=false;
	parent = element;
	while(parent){
		if (parent.id==container) 
			return true;
		else
			parent=parent.parentNode;
	}       
	return false;
}
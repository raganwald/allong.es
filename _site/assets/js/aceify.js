;$(function() {
  var editor;
    
  // for (var property in allong.es) {
  //   if (window[property] == null) {
  //     window[property] = allong.es[property];
  //   }
  // }

  $('pre').each(function (index, element) {
    element = $(element);
    
    var code = element.text(),
        lines = code.split('\n').length,
        editor;
    
    element.replaceWith(
      $('<div></div><br/>')
        .width(element.parent().width())
        .css('height', (lines * 19))
        .text(code)
        .attr('id', 'editor_'+index)
        .css('fontSize','14px')
        .attr('title', 'You can edit this code and press command-enter to reëvaluate it')
    );
    editor = ace.edit('editor_'+index);
    editor.setTheme("ace/theme/monokai");
    editor.container.style.opacity = "";
    editor.session.setMode("ace/mode/javascript");
    editor.setAutoScrollEditorIntoView(true);
    editor.resize();
  
    editor.commands.addCommand({
      name: 'evaluate',
      bindKey: {win: 'Ctrl-Return',  mac: 'Command-Return'},
      exec: recalculate,
      readOnly: true // false if this command should not apply in readOnly mode
    });
    
    recalculate(editor);
    
  });
  
  function recalculate (editor) {
    var code = editor.getValue(),
        lines = code.split("\n"),
        chunks,
        lastChunk;
        
    while (lines[lines.length - 1].match(/^\s*$/)) {
      lines.pop();
    }
        
    if (lines.length === 0) {
      return;
    }
        
    chunks = lines.reduce(
      function (acc, line, index) {
        if (line.match(/^\s*$/)) {
          // do nothing
        }
        else if (line.match(/\/\/=>/)) {
          acc[acc.length - 1].push("//=> " + index);
          acc.push(acc[acc.length - 1].slice(0));
        }
        else acc[acc.length - 1].push(line);
        
        return acc;
      }, [[]]);
      
    chunks = allong.es.filterWith('.length > 0', chunks);
    
    if (chunks.length == 0) {
      return;
    }
    
    chunks = allong.es.map(chunks, function (chunk) {
      var wantsResult = chunk[chunk.length - 1].match(/\/\/=>/),
          resultPosition = wantsResult
                    ? parseInt(chunk.pop().split(' ')[1])
                    : lines.length,
          result;
      
      try {
        result = JSON.stringify(eval(chunk.join('\n')));
        if (wantsResult) {
          lines[resultPosition] = '  //=> ' + result;
        }
      }
      catch (error) {
        lines[resultPosition] = '  //=> ' + error.name + ': ' + error.message;
      }
    });
    
    code = lines.join('\n');
    
    editor.setValue(code);
    
    editor.gotoLine(editor.session.getLength());
      
  };
});
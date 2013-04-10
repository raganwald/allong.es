var editor;
    
for (var property in allong.es) {
  window[property] = allong.es[property];
}
    
$(function() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.container.style.opacity = "";
    editor.session.setMode("ace/mode/javascript");
    editor.setAutoScrollEditorIntoView(true);
    editor.resize();
    
    editor.commands.addCommand({
      name: 'evaluate',
      bindKey: {win: 'Ctrl-Return',  mac: 'Command-Return'},
      exec: function(editor) {
          var code = editor.getValue(),
              lines = code.split("\n"),
              chunks,
              lastChunk;
              
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
                acc.push([]);
              }
              else acc[acc.length - 1].push(line);
              
              return acc;
            }, [[]]);
            
          chunks = filterWith('.length > 0', chunks);
          
          if (chunks.length == 0) {
            return;
          }
          
          chunks = map(chunks, function (chunk) {
            var inline = chunk[chunk.length - 1].match(/\/\/=>/)
              ? parseInt(chunk.pop().split(' ')[1])
              : lines.length
            
            var value = eval(chunk.join('\r'));
            
            if (inline) {
              lines[inline] = '  //=> ' + JSON.stringify(value);
            }
          });
          
          code = lines.join('\r');
          
          editor.setValue(code);
          
      },
      readOnly: true // false if this command should not apply in readOnly mode
  });
});
const serialport = require('serialport');
const createTable = require('data-table');

function init(){
  var port = new serialport('COM3', {autoOpen: false,   baudRate: 115200});
  const Readline = serialport.parsers.Readline;
  const parser = port.pipe(new Readline());

  port.open(function(err) {
    if (err) {
      return console.log('Error opening port: ', err.message);
    }
    // readCard(port);
  });

  parser.on('data', function(data) {
    const cardNumber = data.toString('utf8');
    const stringEsc = String.fromCharCode(27);
    port.write(stringEsc);
    port.write('\r\n');
    port.write(`${cardNumber}\r\n`);
    port.write(`${cardNumber}\r\n`);
    port.write('\r\n\r\n\r\n\r\n');

    readCard(port);
  });
}

function readCard(port){
  const readCommand = `${String.fromCharCode(27)}m996${String.fromCharCode(13)}`
  port.write(readCommand, function(err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('message written');
  });
}

serialport.list((err, ports) => {
  console.log('ports', ports);
  if (err) {
    document.getElementById('error').textContent = err.message;
    return;
  } else {
    document.getElementById('error').textContent = '';
  }

  if (ports.length === 0) {
    document.getElementById('error').textContent = 'No ports discovered';
  }

  const headers = Object.keys(ports[0]);
  const table = createTable(headers);
  tableHTML = '';
  table.on('data', data => (tableHTML += data));
  table.on(
    'end',
    () => (document.getElementById('ports').innerHTML = tableHTML)
  );
  ports.forEach(port => table.write(port));
  table.end();
});

init();

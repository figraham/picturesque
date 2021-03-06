import { OutputTerminal } from '../../output-terminal/OutputTerminal';
import { TerminalConfig } from '../../config/TerminalConfig';

describe('CommandTerminal Units: ', () => {

  let term: OutputTerminal;
  
  it('default constructor unit', () => {
    term = new OutputTerminal();
    expect(term.getWidth()).toEqual(80);
    expect(term.getHeight()).toEqual(25);
  });

  it('param constructor unit', () => {
    const randomDiv: HTMLDivElement = document.createElement('div');
    term = new OutputTerminal({
      width: 10,
      height: 10,
      container: randomDiv,
    } as TerminalConfig, 'Hello!');
    expect(term.getWidth()).toEqual(10);
    expect(term.getHeight()).toEqual(10);
    // @ts-ignore
    expect(term.lineController.lines[term.lineController.lines.length -1].innerHTML).toEqual('Hello!');
  });

  it('param constructor unit', () => {
    term = new OutputTerminal({width: 1} as TerminalConfig, 'This is too long!!!!!!');
    // @ts-ignore
    expect(term.lineController.lines[term.lineController.lines.length -1].innerHTML).toEqual('');
  });

  it('writeln unit', () => {
    term = new OutputTerminal();

    let randoms: string[] = [];
    for (let i = 0; i < 100; i++) {
      randoms.push(Math.random().toString());
    }

    for (let i = 0; i < randoms.length; i++) {
      term.writeln(randoms[i]);
      // @ts-ignore
      expect(term.lineController.lines[term.lineController.lines.length -1].innerHTML).toEqual(randoms[i]);
    }
  });
  
  it('writeln too long unit', () => {
    term = new OutputTerminal();

    let randoms: string[] = [];
    for (let i = 0; i < 100; i++) {
      let s: string = '';
      for (let j = 0; j < 10; j++) {
        s += Math.random().toString();
      }
      randoms.push(s);
    }

    for (let i = 0; i < randoms.length; i++) {
      term.writeln(randoms[i]);
      // @ts-ignore
      expect(term.lineController.lines[term.lineController.lines.length -1].innerHTML).toEqual(randoms[i].substring((Math.floor(randoms[i].length / 80) * 80)));
    }
  });

  it('newLine unit', () => {
    term = new OutputTerminal();
    // @ts-ignore
    expect(term.lineController.lines.length).toEqual(1);

    for (let i = 0; i < 10; i++) {
      term.newLine();
      // @ts-ignore
      expect(term.lineController.lines.length).toEqual(i + 2);
    }
  });

  it('write unit', () => {
    term = new OutputTerminal();
    term.write('hello');
    // @ts-ignore
    expect(term.lineController.lines[0].innerHTML).toEqual('hello');
    term.write(' world!');
    // @ts-ignore
    expect(term.lineController.lines[0].innerHTML).toEqual('hello world!');
  });

  it('write unit', () => {
    term = new OutputTerminal({width: 1});
    term.write('h');
    // @ts-ignore
    expect(term.lineController.lines[0].innerHTML).toEqual('h');
    term.write('i');
    // @ts-ignore
    expect(term.lineController.lines[1].innerHTML).toEqual('i');
  });

  it('write unit', () => {
    term = new OutputTerminal({width: 1});
    term.write('hi');
    // @ts-ignore
    expect(term.lineController.lines[0].innerHTML).toEqual('h');
    // @ts-ignore
    expect(term.lineController.lines[1].innerHTML).toEqual('i');
  });

  it('overwrite fallback unit', () => {
    term = new OutputTerminal();

    term.overwrite('hello');
    // @ts-ignore
    expect(term.lineController.lines[0].innerHTML).toEqual('hello');

    term.overwrite('world!');
    // @ts-ignore
    expect(term.lineController.lines[0].innerHTML).toEqual('hello');
    // @ts-ignore
    expect(term.lineController.lines[1].innerHTML).toEqual('world!');
  });

  it('overwrite fallback width unit', () => {
    term = new OutputTerminal({width: 4});

    term.overwrite('hello');
    // @ts-ignore
    expect(term.lineController.lines[0].innerHTML).toEqual('hell');
    // @ts-ignore
    expect(term.lineController.lines[1].innerHTML).toEqual('o');

    term.overwrite('world!');
    // @ts-ignore
    expect(term.lineController.lines[0].innerHTML).toEqual('hell');
    // @ts-ignore
    expect(term.lineController.lines[1].innerHTML).toEqual('o');
    // @ts-ignore
    expect(term.lineController.lines[2].innerHTML).toEqual('worl');
    // @ts-ignore
    expect(term.lineController.lines[3].innerHTML).toEqual('d!');
  });

  it('overwrite one line unit', () => {
    term = new OutputTerminal();

    term.overwrite('$ hello');
    // @ts-ignore
    expect(term.lineController.lines[0].innerHTML).toEqual('$ hello');

    term.overwrite('$ world!');
    // @ts-ignore
    expect(term.lineController.lines[0].innerHTML).toEqual('$ world!');
  });

  it('overwrite width shorter first unit', () => {
    term = new OutputTerminal({width: 4});

    term.overwrite('$hello');
    // @ts-ignore
    expect(term.lineController.lines[0].innerHTML).toEqual('$hel');
    // @ts-ignore
    expect(term.lineController.lines[1].innerHTML).toEqual('lo');

    term.overwrite('$something!');
    // @ts-ignore
    expect(term.lineController.lines[0].innerHTML).toEqual('$som');
    // @ts-ignore
    expect(term.lineController.lines[1].innerHTML).toEqual('ethi');
    // @ts-ignore
    expect(term.lineController.lines[2].innerHTML).toEqual('ng!');
  });

  it('overwrite width longer first unit', () => {
    term = new OutputTerminal({width: 4});

    term.overwrite('$something!');
    // @ts-ignore
    expect(term.lineController.lines[0].innerHTML).toEqual('$som');
    // @ts-ignore
    expect(term.lineController.lines[1].innerHTML).toEqual('ethi');
    // @ts-ignore
    expect(term.lineController.lines[2].innerHTML).toEqual('ng!');

    term.overwrite('$hello');
    // @ts-ignore
    expect(term.lineController.lines[0].innerHTML).toEqual('$hel');
    // @ts-ignore
    expect(term.lineController.lines[1].innerHTML).toEqual('lo');
    // @ts-ignore
    expect(term.lineController.lines[2].innerHTML).toEqual('');
  });


  it('overwrite linesToCheck unit', () => {
    term = new OutputTerminal({width: 4});

    term.overwrite('$something!');
    // @ts-ignore
    expect(term.lineController.lines[0].innerHTML).toEqual('$som');
    // @ts-ignore
    expect(term.lineController.lines[1].innerHTML).toEqual('ethi');
    // @ts-ignore
    expect(term.lineController.lines[2].innerHTML).toEqual('ng!');

    term.overwrite('$hello');
    // @ts-ignore
    expect(term.lineController.lines[0].innerHTML).toEqual('$hel');
    // @ts-ignore
    expect(term.lineController.lines[1].innerHTML).toEqual('lo');
    // @ts-ignore
    expect(term.lineController.lines[2].innerHTML).toEqual('');

    term.overwrite('$something!');
    // @ts-ignore
    expect(term.lineController.lines[0].innerHTML).toEqual('$som');
    // @ts-ignore
    expect(term.lineController.lines[1].innerHTML).toEqual('ethi');
    // @ts-ignore
    expect(term.lineController.lines[2].innerHTML).toEqual('ng!');
    term.overwrite('$hello');

    // @ts-ignore
    expect(term.linesToCheck).toEqual(3);

    term.resetLinesToCheck();

    // @ts-ignore
    expect(term.linesToCheck).toEqual(0);

  });

});
import fs from 'fs-extra';
import { vol } from 'memfs';
import path from 'path';

import { NcrlJsonAccessor } from '../accessor';
import { InvalidNcrlJsonError } from '../errors';

const fixturesDir = path.join(__dirname, 'fixtures');
const fakeAppPath = '/fake/path/app';

const fsReal = jest.requireActual('fs').promises as typeof fs;
jest.mock('fs');

beforeEach(async () => {
  vol.reset();
});

describe(NcrlJsonAccessor, () => {
  test('patching JSON file', async () => {
    vol.fromJSON(
      {
        './ncrl.json': await fsReal.readFile(path.join(fixturesDir, 'ncrl-json.json'), 'utf-8'),
      },
      fakeAppPath
    );

    const accessor = new NcrlJsonAccessor(fakeAppPath);
    await accessor.readAsync();
    accessor.patch(o => {
      o.build.production.env.ABC = '456';
      return o;
    });
    await accessor.writnCRlync();

    const newNcrlJsonContents = await fs.readFile(path.join(fakeAppPath, 'ncrl.json'), 'utf-8');
    expect(newNcrlJsonContents).toMatchSnapshot();
  });

  test('patching JSON5 file (preserves comments)', async () => {
    vol.fromJSON(
      {
        './ncrl.json': await fsReal.readFile(path.join(fixturesDir, 'ncrl-json5.json'), 'utf-8'),
      },
      fakeAppPath
    );

    const accessor = new NcrlJsonAccessor(fakeAppPath);
    await accessor.readAsync();
    accessor.patch(o => {
      o.build.production.env.ABC = '456';
      return o;
    });
    await accessor.writnCRlync();

    const newNcrlJsonContents = await fs.readFile(path.join(fakeAppPath, 'ncrl.json'), 'utf-8');
    expect(newNcrlJsonContents).toMatchSnapshot();
  });

  test('reading invalid JSON5 object', async () => {
    vol.fromJSON(
      {
        './ncrl.json': await fsReal.readFile(
          path.join(fixturesDir, 'ncrl-invalid-json5.json'),
          'utf-8'
        ),
      },
      fakeAppPath
    );

    const accessor = new NcrlJsonAccessor(fakeAppPath);
    await expect(accessor.readAsync()).rejects.toThrowError(InvalidNcrlJsonError);
    await expect(accessor.readAsync()).rejects.toThrowError(
      /^Found invalid character in .*ncrl\.json.+/
    );
  });

  test('reading empty JSON file', async () => {
    vol.fromJSON(
      {
        './ncrl.json': await fsReal.readFile(path.join(fixturesDir, 'ncrl-empty.json'), 'utf-8'),
      },
      fakeAppPath
    );

    const accessor = new NcrlJsonAccessor(fakeAppPath);
    await expect(accessor.readAsync()).rejects.toThrowError(InvalidNcrlJsonError);
    await expect(accessor.readAsync()).rejects.toThrowError(/^.*ncrl\.json.* is empty\.$/g);
  });
});

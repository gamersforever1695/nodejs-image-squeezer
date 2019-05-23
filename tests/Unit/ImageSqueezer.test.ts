import fs from 'fs';
import ImageSqueezer from '../../src/ImageSqueezer';

import { OperatingSystemException } from '../../src/Exception/OperatingSystemException';
import { ImageSqueezerException } from '../../src/Exception/ImageSqueezerException';

it('should load the image squeezer class', (): void => {
    expect(new ImageSqueezer()).toBeInstanceOf(ImageSqueezer);
});

it('should throw exception operating system not supported', (): void => {
    var imageSqueezer = new ImageSqueezer();
        imageSqueezer.setOperatingSystem('freebsd');
    
    expect(() => {
        imageSqueezer.load();
    }).toThrowError(OperatingSystemException.isNotSupported());
});

it('should throw exception operating system not supported', (): void => {
    var imageSqueezer = new ImageSqueezer();
        imageSqueezer.setOperatingSystem('unknown');
    
    expect(() => {
        imageSqueezer.load();
    }).toThrowError(OperatingSystemException.isNotSupported());
});

it('should provide correct binary path base on the given operating system', (): void => {
    var imageSqueezer = new ImageSqueezer();
        imageSqueezer.setOperatingSystem('win32');
        imageSqueezer.load();

    expect(((imageSqueezer.getFFMpegBin()).search('ffmpeg.exe') !== -1)).toBe(true);
});

it('should throw exception image squeezer source file path empty', (): void => {
    var imageSqueezer = new ImageSqueezer();
        imageSqueezer.load();
        
    expect(() => {
        imageSqueezer.compress();
    }).toThrowError(ImageSqueezerException.emptySourceFilePath());
});

it('should throw exception image squeezer output file path empty', (): void => {
    var imageSqueezer = new ImageSqueezer();
        imageSqueezer.load();
        imageSqueezer.setSourceFilePath('/tmp/examplefile.jpg');

    expect(() => {
        imageSqueezer.compress();
    }).toThrowError(ImageSqueezerException.emptyOutputFilePath());
});

it('should reject when ffmpeg bin path is incorrect or unknown bin', async (): Promise<void> => {
    var mockDirectory = __dirname + '/../Mocks/images/';

    var imageSqueezer = new ImageSqueezer();
        imageSqueezer.load();
        imageSqueezer.setSourceFilePath(mockDirectory + 'uncompressed.jpg');
        imageSqueezer.setOutputFilePath(mockDirectory + 'compressed.jpg');
        imageSqueezer.setFFMpegBin('/home/00000');

        await imageSqueezer.compress().catch((error): void => {
            expect(error).toBe(true);
        });
});

it('should compress image', async (): Promise<void> => {
    var mockDirectory = __dirname + '/../Mocks/images/';

    var imageSqueezer = new ImageSqueezer();
        imageSqueezer.load();
        imageSqueezer.setSourceFilePath(mockDirectory + 'uncompressed.jpg');
        imageSqueezer.setOutputFilePath(mockDirectory + 'compressed.jpg');

        await imageSqueezer.compress().then((resolve): void => {
            expect(fs.existsSync(mockDirectory + 'compressed.jpg')).toBe(true);
        }); 
});

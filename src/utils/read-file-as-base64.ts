export function readFileAsBase64(file: Blob): Promise<string> {
    let fr: FileReader = new FileReader();

    let resolve: (value?: string) => void;
    let reject:  (reason?: any) => void;
    let promise: Promise<string> = new Promise((rs, rj) => {
        resolve = rs;
        reject = rj;
    });

    fr.onload = (): void => {
        let result: string = fr.result as string;
        resolve(result);
    };

    fr.onerror = (): void => {
        reject(fr.error);
    };

    fr.readAsDataURL(file);

    return promise;
}

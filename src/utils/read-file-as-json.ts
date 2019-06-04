export function readFileAsJSON(file: Blob): Promise<unknown> {
    let fr: FileReader = new FileReader();

    let resolve: (value?: unknown) => void;
    let reject:  (reason?: any) => void;
    let promise: Promise<unknown> = new Promise((rs, rj) => {
        resolve = rs;
        reject = rj;
    });

    fr.onload = (): void => {
        let result: string = fr.result as string;
        let json: unknown = JSON.parse(result);
        resolve(json);
    };

    fr.onerror = (): void => {
        reject(fr.error);
    };

    fr.readAsText(file, "utf8");

    return promise;
}

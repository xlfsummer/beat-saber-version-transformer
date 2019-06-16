export default class ErrorHandler {
  static init() {
    window.onerror = ev => {
      if (ev instanceof Event) this.errorHandler(ev);
    };

    window.onunhandledrejection = ev => {
      this.errorHandler(ev.reason);
    };
  }
  private static errorHandler(err: any) {
    let language = navigator.language;
    let promptTip = "Copy following message to help debug：";
    if (language == "zh-CN") {
      promptTip = "程序遇到错误，复制下列错误信息给开发者以帮助调试：";
    }

    if (err instanceof Error) {
      window.prompt(promptTip, err.message + " strack:" + err.stack);
    }
  }
}

import pdfjs from "pdfjs-dist/webpack";

class pdfHandler {
  fetchDocument = async src => {
    return await pdfjs.getDocument(src).promise;
  };

  getPages = async pdf => {
    let promises = [];
    for (let page = 1; page <= pdf.numPages; page++) promises.push(pdf.getPage(page));
    return Promise.all(promises);
  };

  getPageContainer = (page, scale) => {
    return page.getViewport({ scale });
  };

  renderPage = async ({ page, scale, canvasContext }) => {
    let viewport = page.getViewport({ scale });
    await page.render({ canvasContext, viewport }).promise;
  };
}

export default new pdfHandler();

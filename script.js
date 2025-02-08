document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.getElementById('image-container');
    const imageUrlInput = document.getElementById('image-url');
    const addImageButton = document.getElementById('add-image');
    const useArticlePyCheckbox = document.getElementById('use-article-py');
    const runArticlePyButton = document.getElementById('run-article-py');
    const articlePyResultDiv = document.getElementById('article-py-result');
    const searchKeywordInput = document.getElementById('search-keyword'); // キーワード入力欄
    const searchJournalInput = document.getElementById('search-journal'); // 雑誌名入力欄
    const maxResultsInput = document.getElementById('max-results'); // 最大結果数入力欄
    const searchResultsTable = document.getElementById('search-results'); // 検索結果テーブル
    const searchResultsBody = searchResultsTable.querySelector('tbody'); // 検索結果テーブルのbody
    const fileInput = document.getElementById('file-input'); // ファイル入力要素

    // Batch comment elements
    const batchCommentInput = document.createElement('textarea');
    batchCommentInput.placeholder = 'Enter batch comment';
    const applyBatchCommentButton = document.createElement('button');
    applyBatchCommentButton.textContent = 'Apply Batch Comment';
    const batchCommentContainer = document.createElement('div');
    batchCommentContainer.appendChild(batchCommentInput);
    batchCommentContainer.appendChild(applyBatchCommentButton);
    document.querySelector('main').appendChild(batchCommentContainer);

    console.log('JavaScript file loaded.'); // デバッグ用

    // Restore list from local storage
    let imageUrls = JSON.parse(localStorage.getItem('imageUrls')) || [];
    let imageData = JSON.parse(localStorage.getItem('imageData')) || [];
    let undoStack = []; // 削除履歴を保持するスタック（Undo用）
    renderGallery();

    addImageButton.addEventListener('click', () => {
        const imageUrl = imageUrlInput.value;
        if (imageUrl) {
            const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
            imageUrls.push(imageUrl);
            imageData.push({ url: imageUrl, filename: filename, comment1: '', comment2: '', checked1: false, checked2: false });
            localStorage.setItem('imageUrls', JSON.stringify(imageUrls));
            localStorage.setItem('imageData', JSON.stringify(imageData));
            renderGallery();
            imageUrlInput.value = '';
        }
    });

    runArticlePyButton.addEventListener('click', () => {
        console.log('Search articles button clicked.');
        const keyword = searchKeywordInput.value;
        const journal = searchJournalInput.value;
        const maxResults = parseInt(maxResultsInput.value) || 10;
        console.log('Keyword:', keyword, 'Journal:', journal, 'Max Results:', maxResults);
        if (keyword) {
            searchPubMed(keyword, journal, maxResults);
        } else {
            articlePyResultDiv.textContent = 'Please enter a keyword.';
        }
    });

    async function searchPubMed(keyword, journal, maxResults) {
        const apiKey = "add your api key"; // PubMed API key
        const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
        const db = 'pubmed';
        const retmode = 'json';
        const rettype = 'uilist';
        let term = keyword;
        if (journal) {
            term += ` AND ${journal}[Journal]`;
        }
        const retmax = maxResults;

        const searchUrl = `${baseUrl}?db=${db}&retmode=${retmode}&rettype=${rettype}&term=${term}&retmax=${retmax}&api_key=${apiKey}`;

        try {
            const response = await fetch(searchUrl);
            const data = await response.json();

            if (data.esearchresult && data.esearchresult.idlist) {
                const pmidList = data.esearchresult.idlist;
                console.log('PMID List:', pmidList);

                const fetchPromises = pmidList.map(pmid => fetchArticleDetails(pmid));
                const articleDetails = await Promise.all(fetchPromises);

                searchResultsBody.innerHTML = '';

                articleDetails.forEach(article => {
                    const pmid = article.pmid;
                    const title = article.title;
                    const journal = article.journal;
                    const url = `https://www.ncbi.nlm.nih.gov/pubmed/${pmid}`;

                    const row = document.createElement('tr');

                    const pmidCell = document.createElement('td');
                    const pmidLink = document.createElement('a');
                    pmidLink.href = url;
                    pmidLink.textContent = pmid;
                    pmidLink.target = "_blank";
                    pmidCell.appendChild(pmidLink);
                    row.appendChild(pmidCell);

                    const titleCell = document.createElement('td');
                    titleCell.textContent = title;
                    row.appendChild(titleCell);

                    const journalCell = document.createElement('td');
                    journalCell.textContent = journal;
                    row.appendChild(journalCell);

                    searchResultsBody.appendChild(row);
                });

                articlePyResultDiv.textContent = `Searched for keyword "${keyword}" and journal "${journal}". Results: ${pmidList.length}`;
            } else {
                articlePyResultDiv.textContent = 'No results found.';
            }
        } catch (error) {
            console.error('Search Error:', error);
            articlePyResultDiv.textContent = 'An error occurred during the search.';
        }
    }

    async function fetchArticleDetails(pmid) {
        const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';
        const db = 'pubmed';
        const retmode = 'xml';
        const rettype = 'abstract';
        const id = pmid;

        const fetchUrl = `${baseUrl}?db=${db}&retmode=${retmode}&rettype=${rettype}&id=${id}`;

        try {
            const response = await fetch(fetchUrl);
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

            let title = 'Title retrieval error';
            let journal = 'Journal retrieval error';

            try {
                title = xmlDoc.querySelector('ArticleTitle').textContent;
            } catch (e) {
                console.error('Title retrieval error:', e);
            }

            try {
                journal = xmlDoc.querySelector('Journal > Title').textContent;
            } catch (e) {
                console.error('Journal retrieval error:', e);
            }

            return {
                pmid: pmid,
                title: title,
                journal: journal
            };
        } catch (error) {
            console.error('Error retrieving article details:', error);
            return {
                pmid: pmid,
                title: 'Title retrieval error',
                journal: 'Journal retrieval error'
            };
        }
    }

    function renderGallery() {
        imageContainer.innerHTML = ''; // Clear container
        imageData.forEach((item, index) => {
            let mediaElement;
            if (item.url.toLowerCase().endsWith('.pdf')) {
                mediaElement = document.createElement('iframe');
                mediaElement.src = item.url;
                mediaElement.style.width = "100%";
                mediaElement.style.height = "500px";
                mediaElement.style.border = "none";
            } else {
                mediaElement = document.createElement('img');
                mediaElement.src = item.url;
                mediaElement.alt = 'Gallery Image';
                mediaElement.referrerpolicy = "no-referrer";
            }

            mediaElement.addEventListener('click', () => {
                if (item.url.toLowerCase().endsWith('.pdf')) {
                    // 既存の動作：新しいタブで開く
                    window.open(item.url, '_blank');
                } else {
                    const overlay = document.createElement('div');
                    overlay.classList.add('overlay');
                    document.body.appendChild(overlay);
                    const fullscreenImg = document.createElement('img');
                    fullscreenImg.src = mediaElement.src;
                    fullscreenImg.classList.add('fullscreen');
                    document.body.appendChild(fullscreenImg);
                    overlay.addEventListener('click', () => {
                        document.body.removeChild(overlay);
                        document.body.removeChild(fullscreenImg);
                    });
                    fullscreenImg.addEventListener('click', () => {
                        document.body.removeChild(overlay);
                        document.body.removeChild(fullscreenImg);
                    });
                }
            });

            const filenameDiv = document.createElement('div');
            filenameDiv.textContent = item.url;
            // URLテキストの選択を可能にする設定
            filenameDiv.style.userSelect = 'text';
            filenameDiv.draggable = false;
            // 親要素のドラッグ操作への伝播を防ぐ
            filenameDiv.addEventListener('mousedown', (e) => {
                e.stopPropagation();
            });
            // dragstartも防ぐことで、ドラッグ操作時にテキスト選択が働くようにする
            filenameDiv.addEventListener('dragstart', (e) => {
                e.preventDefault();
            });
            // ダブルクリック時にテキストを選択する
            filenameDiv.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                const range = document.createRange();
                range.selectNodeContents(filenameDiv);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            });

            // Comment and checkbox elements
            const comment1Label = document.createElement('label');
            comment1Label.textContent = '';
            const comment1Input = document.createElement('input');
            comment1Input.type = 'text';
            comment1Input.placeholder = 'Add a comment';
            comment1Input.value = item.comment1;
            comment1Input.addEventListener('input', (e) => {
                item.comment1 = e.target.value;
                localStorage.setItem('imageData', JSON.stringify(imageData));
            });

            const checkbox1 = document.createElement('input');
            checkbox1.type = 'checkbox';
            checkbox1.checked = item.checked1;
            checkbox1.addEventListener('change', (e) => {
                item.checked1 = e.target.checked;
                localStorage.setItem('imageData', JSON.stringify(imageData));
            });
            const checkbox1Label = document.createElement('label');
            checkbox1Label.textContent = '';

            const comment2Label = document.createElement('label');
            comment2Label.textContent = '';
            const comment2Input = document.createElement('input');
            comment2Input.type = 'text';
            comment2Input.placeholder = 'Add a comment';
            comment2Input.value = item.comment2;
            comment2Input.addEventListener('input', (e) => {
                item.comment2 = e.target.value;
                localStorage.setItem('imageData', JSON.stringify(imageData));
            });

            const checkbox2 = document.createElement('input');
            checkbox2.type = 'checkbox';
            checkbox2.checked = item.checked2;
            checkbox2.addEventListener('change', (e) => {
                item.checked2 = e.target.checked;
                localStorage.setItem('imageData', JSON.stringify(imageData));
            });
            const checkbox2Label = document.createElement('label');
            checkbox2Label.textContent = '';

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                deleteImage(index);
            });

            const imageWrapper = document.createElement('div');
            imageWrapper.classList.add('image-wrapper');

            // ドラッグ＆ドロップ用の設定
            imageWrapper.draggable = true;
            imageWrapper.addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text/plain', index);
            });
            imageWrapper.addEventListener('dragover', (event) => {
                event.preventDefault();
            });
            imageWrapper.addEventListener('drop', (event) => {
                event.preventDefault();
                const sourceIndex = event.dataTransfer.getData('text/plain');
                if (sourceIndex === '') return;
                const srcIdx = parseInt(sourceIndex, 10);
                if (srcIdx === index) return;
                const draggedImageData = imageData[srcIdx];
                const draggedImageUrl = imageUrls[srcIdx];
                imageData.splice(srcIdx, 1);
                imageUrls.splice(srcIdx, 1);
                imageData.splice(index, 0, draggedImageData);
                imageUrls.splice(index, 0, draggedImageUrl);
                localStorage.setItem('imageData', JSON.stringify(imageData));
                localStorage.setItem('imageUrls', JSON.stringify(imageUrls));
                renderGallery();
            });

            imageWrapper.appendChild(mediaElement);
            imageWrapper.appendChild(filenameDiv);
            imageWrapper.appendChild(comment1Label);
            imageWrapper.appendChild(comment1Input);
            imageWrapper.appendChild(checkbox1);
            imageWrapper.appendChild(checkbox1Label);
            imageWrapper.appendChild(comment2Label);
            imageWrapper.appendChild(comment2Input);
            imageWrapper.appendChild(checkbox2);
            imageWrapper.appendChild(checkbox2Label);
            imageWrapper.appendChild(deleteButton);

            // 大画面表示ボタンを追加（PDFの場合のみ）
            if (item.url.toLowerCase().endsWith('.pdf')) {
                const fullScreenButton = document.createElement('button');
                fullScreenButton.textContent = 'expansion';
                fullScreenButton.addEventListener('click', () => {
                    openPdfFullscreen(item.url);
                });
                imageWrapper.appendChild(fullScreenButton);
            }

            imageContainer.appendChild(imageWrapper);
        });

        applyBatchCommentButton.addEventListener('click', () => {
            const batchComment = batchCommentInput.value;
            if (!batchComment) return;
            imageData.forEach(item => {
                if (item.checked1) {
                    item.comment1 = batchComment;
                }
                if (item.checked2) {
                    item.comment2 = batchComment;
                }
            });
            localStorage.setItem('imageData', JSON.stringify(imageData));
            renderGallery();
            batchCommentInput.value = '';
        });
    }

    function deleteImage(index) {
        const deletedUrl = imageUrls.splice(index, 1)[0];
        const deletedData = imageData.splice(index, 1)[0];
        // 削除前の状態をundoStackに保存
        undoStack.push({ index, deletedUrl, deletedData });
        localStorage.setItem('imageUrls', JSON.stringify(imageUrls));
        localStorage.setItem('imageData', JSON.stringify(imageData));
        renderGallery();
    }

    function undoDelete() {
        if (undoStack.length > 0) {
            const lastDeletion = undoStack.pop();
            imageUrls.splice(lastDeletion.index, 0, lastDeletion.deletedUrl);
            imageData.splice(lastDeletion.index, 0, lastDeletion.deletedData);
            localStorage.setItem('imageUrls', JSON.stringify(imageUrls));
            localStorage.setItem('imageData', JSON.stringify(imageData));
            renderGallery();
        }
    }

    // PDF用の大画面表示関数
    function openPdfFullscreen(pdfUrl) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.zIndex = '10000';

        const pdfFrame = document.createElement('iframe');
        pdfFrame.src = pdfUrl;
        pdfFrame.style.width = '90%';
        pdfFrame.style.height = '90%';
        pdfFrame.style.border = 'none';
        pdfFrame.style.display = 'block';
        pdfFrame.style.margin = '5% auto';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '閉じる';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '20px';
        closeBtn.style.right = '20px';
        closeBtn.style.fontSize = '18px';
        closeBtn.style.padding = '10px 20px';
        closeBtn.style.zIndex = '10001';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        overlay.appendChild(closeBtn);
        overlay.appendChild(pdfFrame);
        document.body.appendChild(overlay);
    }

    function exportData() {
        const imageUrls = JSON.parse(localStorage.getItem('imageUrls')) || [];
        const imageData = JSON.parse(localStorage.getItem('imageData')) || [];
        const data = {
            imageUrls: imageUrls,
            imageData: imageData
        };
        const json = JSON.stringify(data);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        a.download = `image_data_${year}-${month}-${day}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const json = e.target.result;
                try {
                    const data = JSON.parse(json);
                    imageUrls = data.imageUrls || [];
                    imageData = data.imageData || [];
                    localStorage.setItem('imageUrls', JSON.stringify(imageUrls));
                    localStorage.setItem('imageData', JSON.stringify(imageData));
                    renderGallery();
                    alert('JSON data loaded successfully.');
                } catch (error) {
                    console.error('Error loading JSON data:', error);
                    alert('Failed to load JSON data.');
                }
            };
            reader.readAsText(file);
        }
    });

    // Add export button
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export Data';
    exportButton.addEventListener('click', exportData);
    document.querySelector('main').appendChild(exportButton);

    // 専用のUIボタン：クリップボードから画像URLを追加
    const clipboardButton = document.createElement('button');
    clipboardButton.textContent = 'クリップボードから画像を追加';
    clipboardButton.style.backgroundColor = '#4CAF50';
    clipboardButton.style.color = 'white';
    clipboardButton.style.padding = '10px 20px';
    clipboardButton.style.fontSize = '16px';
    clipboardButton.style.border = 'none';
    clipboardButton.style.borderRadius = '5px';
    clipboardButton.style.cursor = 'pointer';
    clipboardButton.style.margin = '10px';
    clipboardButton.id = "clipboardButton";
    clipboardButton.addEventListener('click', async () => {
        try {
            const url = await navigator.clipboard.readText();
            if (url) {
                const filename = url.substring(url.lastIndexOf('/') + 1);
                imageUrls.push(url);
                imageData.push({ url: url, filename: filename, comment1: '', comment2: '', checked1: false, checked2: false });
                localStorage.setItem('imageUrls', JSON.stringify(imageUrls));
                localStorage.setItem('imageData', JSON.stringify(imageData));
                renderGallery();
            } else {
                alert('クリップボードに画像URLが見つかりませんでした。');
            }
        } catch(e) {
            console.error('Clipboard read failed:', e);
            alert('クリップボードからの読み込みに失敗しました。');
        }
    });
    document.querySelector('main').appendChild(clipboardButton);

    // キーボードショートカットの実装：Ctrl+Shift+V (MacではCommand+Shift+V)
    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'v') {
            clipboardButton.click();
            event.preventDefault();
        }
    });

    // キーボードショートカットの実装：Command+Z で削除を元に戻す
    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === 'z') {
            undoDelete();
            event.preventDefault();
        }
    });

    // カスタムコンテキストメニューの実装（capturingフェーズでリスナーを登録）
    let currentContextUrl = '';
    const customContextMenu = document.createElement('div');
    customContextMenu.id = 'custom-context-menu';
    customContextMenu.style.position = 'absolute';
    customContextMenu.style.display = 'none';
    customContextMenu.style.background = '#fff';
    customContextMenu.style.border = '1px solid #ccc';
    customContextMenu.style.padding = '5px';
    customContextMenu.style.zIndex = '10000';
    const addImageContextOption = document.createElement('div');
    addImageContextOption.textContent = 'コピーして登録';
    addImageContextOption.style.cursor = 'pointer';
    customContextMenu.appendChild(addImageContextOption);
    document.body.appendChild(customContextMenu);

    document.addEventListener('contextmenu', (event) => {
        console.log('contextmenu event triggered', event);
        let target = event.target;
        let urlToAdd = '';
        if (target.tagName.toLowerCase() === 'img' && target.src) {
            urlToAdd = target.src;
        } else if (target.tagName.toLowerCase() === 'a' && target.href) {
            urlToAdd = target.href;
        } else if (target.tagName.toLowerCase() === 'div' && target.textContent.startsWith('URL: ')) {
            urlToAdd = target.textContent.substring(5).trim();
        }
        if (urlToAdd) {
            event.preventDefault();
            event.stopPropagation();
            currentContextUrl = urlToAdd;
            customContextMenu.style.top = event.pageY + 'px';
            customContextMenu.style.left = event.pageX + 'px';
            customContextMenu.style.display = 'block';
        } else {
            customContextMenu.style.display = 'none';
        }
    }, true);

    addImageContextOption.addEventListener('click', () => {
        if (currentContextUrl) {
            const filename = currentContextUrl.substring(currentContextUrl.lastIndexOf('/') + 1);
            imageUrls.push(currentContextUrl);
            imageData.push({ url: currentContextUrl, filename: filename, comment1: '', comment2: '', checked1: false, checked2: false });
            localStorage.setItem('imageUrls', JSON.stringify(imageUrls));
            localStorage.setItem('imageData', JSON.stringify(imageData));
            renderGallery();
        }
        currentContextUrl = '';
        customContextMenu.style.display = 'none';
    });

    document.addEventListener('click', () => {
        customContextMenu.style.display = 'none';
    });
});
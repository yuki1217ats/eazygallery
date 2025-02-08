# 🚀 Gallery ブラウザ拡張機能
Gallery Extension

<p align="center">
  <img src="assets/header.svg" alt="Header Image">
</p>

## プロジェクト概要
本プロジェクトは、シンプルなブラウザ拡張機能として実装されています。  
HTML, CSS, JavaScriptを用いて、URLから画像を取得し、ギャラリー表示する機能を実装しています。  
This project is implemented as a simple browser extension, developed using HTML, CSS, and JavaScript, to fetch images from URLs and display them in a gallery.


## 機能
- **背景スクリプト**: 拡張機能がバックグラウンドで実行され、ページの状態を監視します。  
  Background Script: Runs in the background to monitor page status.
- **コンテントスクリプト**: ページにスクリプトを注入し、基本的なDOM操作を行います。  
  Content Script: Injects scripts into web pages to perform basic DOM manipulations.
- **ポップアップ表示**: `index.html` により、ユーザーに拡張機能のUIを提供します。  
  Popup Display: Provides UI via `index.html` for user interaction.
- **URLからの画像取得とギャラリー表示**: ユーザーが指定したURLから画像を取得し、ギャラリー形式で表示します。
  Image acquisition and gallery display from URL: Fetches images from URLs specified by the user and displays them in a gallery format.
- **PubMed検索機能**: PubMed APIを利用して、キーワードと雑誌名に基づいて論文を検索し、結果を表示します。
  PubMed search function: Uses the PubMed API to search for articles based on keywords and journal names and displays the results.
- **クリップボードからの画像URL追加機能**: クリップボードにコピーされた画像URLをワンクリックでギャラリーに追加できます。
  Add image URL from clipboard function: Allows adding image URLs copied to the clipboard to the gallery with a single click.
- **PDF表示機能**: PDFファイルのURLを指定すると、ギャラリー内でPDFを表示できます。
  PDF display function: Allows displaying PDFs within the gallery by specifying the URL of the PDF file.
- **ドラッグ&ドロップによる画像の並び替え機能**: ギャラリー内の画像をドラッグ&ドロップで並び替えることができます。
  Drag & drop image reordering function: Allows reordering images in the gallery by drag and drop.
- **コメント機能**: 各画像にコメントを追加できます。
  Comment function: Allows adding comments to each image.
- **エクスポート機能**: ギャラリーの画像URLとコメントデータをJSON形式でエクスポートできます。
  Export function: Allows exporting image URLs and comment data from the gallery in JSON format.
- **削除とUndo機能**: 画像の削除と削除の取り消し（Undo）が可能です。
  Delete and Undo function: Allows deleting images and undoing deletions.
- **コンテキストメニューからの画像追加機能**: 画像のコンテキストメニューからURLをコピーしてギャラリーに追加できます。
  Add image function from context menu: Allows adding URLs from the image context menu to the gallery.
- **キーボードショートカット**: クリップボードからの画像追加（Ctrl+Shift+V/Command+Shift+V）、削除のUndo（Ctrl+Z/Command+Z）をサポートしています。
  Keyboard shortcuts: Supports adding images from the clipboard (Ctrl+Shift+V/Command+Shift+V) and undoing deletions (Ctrl+Z/Command+Z).

## 特徴
- シンプルで直感的なコード構造  
  Simple and intuitive code structure.
- Chrome拡張機能としての基本機能実装  
  Basic implementation of Chrome extension functionalities.
- デモページによる視覚的な検証  
  Visual validation through a demo page.

## ディレクトリ構造
├── .DS_Store  
├── assets/         # ヘッダー画像などのリソース  
├── background.js   # 背景スクリプト  
├── content_script.js  # ページに挿入されるスクリプト  
├── index.html      # デモページまたはポップアップ画面  
├── manifest.json   # 拡張機能のマニフェスト  
├── script.js       # デモページのスクリプト  
└── style.css       # デモページのスタイルシート  
Directory structure / Header image, scripts, and other resources.

## インストール方法
1. リポジトリをクローンし、Chromeの「パッケージ化されていない拡張機能を読み込む」で展開します。  
Clone the repository and load it via Chrome's "Load unpacked extension" feature.

##　免責
利用は自己責任でお願いします。
画像取得は各URLに準拠してください。
Use at your own risk.
When obtaining images, please follow the policies of each respective URL.


## 開発
HTML, CSS, JavaScriptを使用して開発しています。  
After editing, verify the changes on Chrome.

## 開発ルール
- **DRY (Don't Repeat Yourself)**: 重複コードの排除を心掛け、再利用性を高める。
- **責務の分離**: 各モジュール・関数は単一の責務を持つように設計する。
- **KISS (Keep It Simple, Stupid)**: 可能な限りシンプルな設計を維持する。
- **防御的プログラミング**: 入力値検証や例外処理を徹底し、堅牢なコードを書く。
- **SOLID原則**: 拡張性と保守性を高めるため、SOLID原則に従った設計を行う。

## コミットガイドライン
- コミットタイトルは絵文字で始め、日本語で変更内容を記述する。  
  例: `✨ feat: 新機能追加`, `🐛 fix: バグ修正`
- コミットメッセージは簡潔かつ具体的に記述する。

---
このREADMEはプロジェクトの進行に合わせて随時更新されます。

## リポジトリ / Repository
GitHub: [eazygallery](https://github.com/yuki1217ats/eazygallery)

# 🚀 Gallery ブラウザ拡張機能
Gallery Extension

<p align="center">
  <img src="assets/header.svg" alt="Header Image">
</p>

## プロジェクト概要
本プロジェクトは、シンプルな拡張機能として実装されています。  
HTML, CSS, JavaScriptを用いて、基本的な拡張機能の機能を実装しています。  
This project is implemented as a simple extension, developed using HTML, CSS, and JavaScript, demonstrating fundamental extension functionalities.

## 機能
- **背景スクリプト**: 拡張機能がバックグラウンドで実行され、ページの状態を監視します。  
  Background Script: Runs in the background to monitor page status.
- **コンテントスクリプト**: ページにスクリプトを注入し、基本的なDOM操作を行います。  
  Content Script: Injects scripts into web pages to perform basic DOM manipulations.
- **ポップアップ表示**: `index.html` により、ユーザーに拡張機能のUIを提供します。  
  Popup Display: Provides UI via `index.html` for user interaction.

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

## 開発
HTML, CSS, JavaScriptを使用して開発しています。  
After editing, verify the changes on Chrome.

## コミットメッセージのルール
コミットには絵文字を先頭に付け、日本語で変更内容を記述します。  
For example: `✨ feat: 新機能追加`, `🐛 fix: バグ修正`.

## ライセンス
MITライセンス  
MIT License

---
このREADMEはプロジェクトの進行に合わせて更新されます。  
This README will be updated as the project evolves.

## リポジトリ / Repository
GitHub: [eazygallery](https://github.com/yuki1217ats/eazygallery)

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { MainPage } from './pages/main/index.js';

const root = document.getElementById('root');
const mainPage = new MainPage(root);
mainPage.render();

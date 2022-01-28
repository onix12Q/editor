<img width="400" src="https://github.com/onix12Q/editor/blob/master/img/image_4.png">
<img width="400" src="https://github.com/onix12Q/editor/blob/master/img/paintSprites.png">
<img width="400" src="https://github.com/onix12Q/editor/blob/master/img/effects.png">
<img width="400" src="https://github.com/onix12Q/editor/blob/master/img/img_compare.png">
<img width="400" src="https://github.com/onix12Q/editor/blob/master/img/img1.png">
<img width="400" src="https://github.com/onix12Q/editor/blob/master/img/lastic_star.png">

Приложение для работы с растровой графикой.

Ссылка на редактор  https://onix12q.github.io/editor/index.html

При наведении и удержании курсора мыши над большинством кнопок появляется краткое описание функции данной кнопки, на которые следует ориентироваться.

Для загрузки картинки нужно указать ее url (сервер на котором размещена картинка должен поддерживать crossorigin запросы), либо загрузить с компютера нажав кнопку load img.

После загрузки картинку можно масштабировать или отразить, по оси x, y или обоим направлениям.

Для начала работы нужно создать выделение: кликая по холсту мышью (замкнутый контур) затем его можно отредактировать перемещая либо добавляя контрольные точки, либо сбросить и начать все заново. 

Выделенную область можно залить каким либо цветом, добавить ей прозрачность либо применить какой либо цветовой эффект, а также масштабировать, отразить и повернуть на какой либо градус.

Для искажения (масштабирования по точкам) выделенной области необходимо нажать кнопку "искажать", выбрать ось "xy", "x" или "у", затем перетаскивать точки в новое положение.

По оси "xy" для искажения используется библиотека <a href="https://chenxing.name/fun/imgwarp-js/">**imgwarp-js**</a>, добавление точек деформации - Ctrl+Click, удаление - Shift+Click.
После окончания деформации, для возвращения в обычный режим нужно нажать кнопку "Перемещать точку".

По осям x и y нужно просто перетаскивать точки контура в новое положение и картинка внутри него сама будет заполнять - подстраиваться под контур автоматически.

После всех манипуляций область можно скопировать в спрайт (создать спрайт), а затем переместить в новое положение и создать с него отпечаток на фоновом изображении, спрайты также можно масштабировать, отражать и  вращать.

Спрайтами можно рисовать - кликнуть кнопку "штамп курсор", и перетаскивать спрайт с зажатой кнопкой мыши, при включении данного режима спрайт можно масштабировать колесиком мыши.

При работе со спрайтами часть кнопок скрывается, остаются только те которые можно применить к спрайтам. Чтобы вернуться к работе с фоновым изображением, созданию и редактированию контура нужно нажать на кнопку "работать с фоновым изображением".

Масштабирование спрайта идет от центра в обоих направлениях. 
При масштабировании и вращении спрайта, сначала считается масштабирование относительно начального размера, затем поворот относительно центра уже отмасштабированого спрайта.
Поворот также считается относительно начального градуса = 0.
При отражении спрайта убирается вращение затем производится отражение, затем вращается сново уже отраженным.
При масштабировании спрайта со скругленными углами если масштаб по оси x отличается от масштаба по оси y может появиться несовпадение контура и картинки спрайта.

При окончании работы спрайт можно сохранить в локальном хранилище нажав на кнопку Save, а затем восстановить нажав Показать сохраненные спрайты => создать

Для сохранения спрайтов в спрайт-листы можно использовать модуль <a href="https://github.com/onix12Q/editor/blob/master/js/modules/spriteMatrix.js"> spriteMatrix </a>

Для искажения углов и создания 3d эффектов, можно использовать модуль <a href="https://github.com/onix12Q/editor/blob/master/js/modules/perspectiveTransform.js">perspectiveTransform </a>

<p>
	Толщину линий обводки контура и цвет а также другие параметры, можно изменить в панели:  "Загрузить модуль, изменить настройки"				
	<ul>
		<li>Толщина обводки контура: lineWidth = 3;</li>
		<li>Цвет обвоки контура спрайтов: colorSpriteArea = "green";</li>
		<li>Цвет обводки  контура фона:  colorCommonArea = "red";</li>
		<li>Размер квадрата точки контура/2: halfPointSize = 5;</li>
		<li>Максимальное количество шагов назад при редактировании фона: backStepCounts = 3; </li>
		<li>Стартоваое изображение по умолчанию (можно заменить на чистый холст заданных размеров): imgSrc = "./img/dolphin.jpg";</li>
		<li>Уменьшение холста относительно картинки: littleCanvas = false; true - если холст больше размера картинки уменьшает размер холста, false - рисует картинку в левом верхнем углу</li>
	</ul>
</p>

<b style="font-weight: bold;">Создание эффектов с помощью контура выделенной области</b>

Для создания цветовых эффектов нужно выделить контуром область эффекта, ввести условие в одну из четырех полей формы R G B A (например 0 в поле A 0-255 чтобы область стала прозрачной) или в форму "применить функцию" и кликнуть по соответствующей кнопке.

<b style="font-weight: bold;">Эффекты форм с помощью спрайтов.</b> 

Форма "применить функцию" и "применить к выделению" для контура спрайта. Кнопка клавиатуры "Q" данные из формы "применить к выделению" - при перемещении спрайта, "E" данные из формы "применить функцию", "W"  - данные из формы "применить к выделению" для точечного применения.
Для их использования необходимо задать условие в одну из форм, затем выбрать спрайт, и нажать кнопку W или E. Q - для эфекктов при движении спрайта по экрану с нажатой кнопкой мыши и кнопкой "Q" соответственно.

<b style="font-weight: bold;">Прозрачность на основе красного или другого цвета</b>

Функция сравнения картинки спрайта и картинки под спрайтом(фона) работает на основе формы "применить функцию" - кнопка клавиатуры "S".
Сравниваемые значения R, G, B, A и R1, G1, B1, A1. Где слева - значения пикселей холста, а справа - спрайта.

Таким образом можно складывать или вычитать изображение фона с изображением спрайта, чтобы делать различные виды масок, интенсивность прозрачности на основе интенсивности цвета маски и т.д. 
В примере ниже создан дырявый и облачный ластик (A = A-R1+10).


           


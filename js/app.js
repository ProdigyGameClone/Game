class GameField {
	constructor(userName) {
		this.user = new User(userName, 0);
		this.round = 1;
		this.roundWeight = 25;
		this.initCanvas();
		this.initMonster();
		this.monsterFullName = this.generateMonsterName();
		this.initScore(100, 100);
		this.initRound();
		this.initSpells();
	}

	initCanvas() {
		this.canvas = document.getElementById('canvas');
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		window.addEventListener('resize', this.resizeCanvas, false);
		const imageWidth = window.innerWidth / 11,
		imageHeight = window.innerHeight / 6;
		this.canvas.addEventListener('click', (e) => {
			this.chooseSpell(e, imageWidth, imageHeight);
		});
	}

	initHorse() {
		let horseImage = new Image();
		horseImage.src = 'images/horse1.png';
		horseImage.addEventListener('load', () => {
			this.mainCharacter = new Horse(this.canvas, this.context, horseImage,
				[0, 0], [window.innerWidth * 0.1, window.innerHeight * 0.4],
				[160, 120], [window.innerWidth * 0.25, window.innerHeight * 0.35], 3, [0, 1, 2, 3, 2, 1]);
			this.initBurst();
			this.lastTime = Date.now();
			this.main();
		});
	}

	initScore(mainCharacterHp, villianHp) {
		let width = window.innerWidth, height = window.innerHeight;
		let starImage = new Image();
		starImage.src = 'images/star.png';
		starImage.addEventListener('load', () => {
			this.scoreMainCharacter = new Score(this.user.characterName, starImage, this.canvas, this.context, [width / 35, height / 25], [width / 10, width / 10], 1, mainCharacterHp);
			this.scoreVillian = new Score(this.monsterFullName, starImage, this.canvas, this.context, [width - width / 10 - width / 35, height / 25], [width / 10, width / 10], -1, villianHp);
			this.scoreMainCharacter.render();
			this.scoreVillian.render();
		});
	}

	initMonster() {
		let monsterImagesArray = [];
		let monsterImagesNumber = 0;
		let width = window.innerWidth, height = window.innerHeight;
		let monsterBodyImage = new Image();
		monsterBodyImage.src = `images/body/${getRandomInt(1, 5)}.png`;
		monsterImagesArray.push(monsterBodyImage);
		let monsterHeadImage = new Image();
		monsterHeadImage.src = `images/head/${getRandomInt(1, 12)}.png`;
		monsterImagesArray.push(monsterHeadImage);
		let monsterWeaponsImage = new Image();
		monsterWeaponsImage.src = `images/weapons/${getRandomInt(1, 9)}.png`;
		monsterImagesArray.push(monsterWeaponsImage);
		let monsterBootsImage = new Image();
		monsterBootsImage.src = 'images/boots/boots.png';
		monsterImagesArray.push(monsterBootsImage);
		monsterImagesArray.forEach((image) => {
			image.addEventListener('load', () => {
				++monsterImagesNumber;
				if (monsterImagesNumber == 4) {
					this.monster = new Monster(monsterBodyImage, monsterHeadImage, monsterWeaponsImage, 
						monsterBootsImage, getRandomInt(0, 14), this.canvas, this.context,
						[width * 0.7, height * 0.4], [width / 7, width / 7], 2, 30);
					this.initHorse();
				}
			})
		});
	}

	generateMonsterName() {
		let adjective = ["Terrible", "Spiteful", "Snotty"];
		let type = ["Ogre", "Gnome", "Goblin"];
		let name = ["Max", "Tom", "John"];
		return `${adjective[getRandomInt(0, adjective.length - 1)]} ${type[getRandomInt(0, type.length - 1)]} ${name[getRandomInt(0, name.length - 1)]}`;
	}

	initRound() {
		let width = window.innerWidth, height = window.innerHeight;
		let roundImage = new Image();
		roundImage.src = 'images/star1.png';
		roundImage.addEventListener('load', () => {
			this.context.drawImage(roundImage,
				width * 0.46, 0,
				width * 0.1, width * 0.11);
			this.context.fillText(this.round, window.innerWidth * 0.504, window.innerHeight * 0.11);
			this.context.font = styles.font;
			this.context.fillText("Round", window.innerWidth * 0.495, window.innerHeight * 0.11 + 30);
		});
	}

	initSpells() {
		this.context.fillStyle = styles.fillStyle;
		this.context.fillRect(window.innerWidth / 2.3, window.innerHeight / 1.2, window.innerWidth * 0.2, window.innerHeight * 0.2);
		this.context.fillStyle = styles.spells.fillStyle;
		this.context.strokeStyle = styles.spells.strokeStyle;
		this.context.font = styles.spells.font;
		this.context.fillText("Spells", window.innerWidth / 2, window.innerHeight / 1.22);
		let health = new Image();
		health.src = 'images/heart.png';
		let sword = new Image();
		sword.src = 'images/sword.png';
		health.addEventListener('load', () => {
			this.context.drawImage(health, window.innerWidth / 2.25, window.innerHeight / 1.2, window.innerWidth / 11, window.innerHeight / 6);

		});
		sword.addEventListener('load', () => {
			this.context.drawImage(sword, window.innerWidth / 1.85, window.innerHeight / 1.2, window.innerWidth / 11, window.innerHeight / 6);
		});
	}

	chooseSpell(e, imageWidth, imageHeight) {
		const pos = {
			x: e.clientX,
			y: e.clientY
		};
		if (pos.x >= window.innerWidth / 2.25 && pos.x <= window.innerWidth / 2.25 + imageWidth) { //identify user's click
			if (pos.y >= window.innerHeight / 1.2 && pos.y <= window.innerHeight / 1.2 + imageHeight) //user has clicked on health spell
				if (this.scoreMainCharacter.hp < 100)
					this.initTaskScreen('health');
			}
			if (pos.x >= window.innerWidth / 1.85 && pos.x <= window.innerWidth / 1.85 + imageWidth) { //user has clicked on sword spell
				if (pos.y >= window.innerHeight / 1.2 && pos.y <= window.innerHeight / 1.2 + imageHeight)
					this.initTaskScreen('sword');
			}
		};


		initTaskScreen(spell) {
			let background = "url('images/platformer_background_1.png')";
			this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
			cancelAnimationFrame(this.animation);
			this.canvas.style.background = background;
			let observer = new EventObserver();
			observer.subscribe(userAnswer => {
				setTimeout(() => this.processUserAnswer(userAnswer), 1000);
			});
			this.task = new Task(this.canvas, this.context, spell, observer);
		}

		processUserAnswer(userAnswer) {
			this.context.textAlign = styles.textAlign;
			this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
			let background = "url('images/platformer_background_3.png')";
			this.canvas.style.background = background;
			let flag = 0;

			if (this.task.spell == 'health' && userAnswer) {
				this.burst.addingHealth(this.mainCharacter.horsePos, this.mainCharacter.horseSize);
				this.scoreMainCharacter.hp += Math.round(this.roundWeight * 1.1);
				if (this.scoreMainCharacter.hp > 100)
					this.scoreMainCharacter.hp = 100;
			}
			else if (userAnswer) {
				this.scoreVillian.hp -= this.roundWeight;
				if (this.scoreVillian.hp > 0)
					this.burst.strike(this.mainCharacter.horsePos, this.mainCharacter.horseSize, this.monster.pos);
			}

			else if (!userAnswer) {
				this.burst.strike(this.monster.pos, this.mainCharacter.horseSize, this.mainCharacter.horsePos);
				flag = 1;
				this.villianHit();
			}

			if (this.scoreVillian.hp <= 0) {
				this.round += 1;
				this.user.defiatedMonstersNumber += 1;
				this.scoreVillian.characterName = this.generateMonsterName();
				this.scoreVillian.hp = 100;
				this.scoreMainCharacter.hp = 100;
				this.initMonster();
			}
			else if (!flag)
				setTimeout(() => {
					this.burst.strike(this.monster.pos, this.mainCharacter.horseSize, this.mainCharacter.horsePos);
					this.villianHit();

				}, 3000);

			this.scoreMainCharacter.render();
			this.scoreVillian.render();
			this.initRound();
			this.initSpells();
			this.main();
		}

		initBurst() {
			let heartsImage = new Image();
			heartsImage.src = 'images/hearts.png';
			let burstImage = new Image();
			burstImage.src = 'images/burst.png';
			burstImage.addEventListener('load', () => {
				this.burst = new Burst(burstImage, heartsImage, this.canvas, this.context, [100, 100], 7);
			});
		}

		get context() {
			return this.canvas.getContext('2d');
		}

		villianHit() {
			let width = window.innerWidth, height = window.innerHeight;
			this.context.clearRect(width / 35, height / 25, width / 10, width / 10);
			this.scoreMainCharacter.hp -= this.roundWeight;
			this.scoreMainCharacter.render();
			setTimeout(() => {
				this.scoreMainCharacter.render();
			}, 1000);
			
			if (this.scoreMainCharacter.hp <= 0) {
				setTimeout(() => {
					let tableResults = new Table(this.user);
				},3000);
			}
		}

		main() {
			let now = Date.now();
			let dt = (now - this.lastTime) / 1000.0;

			this.update(dt);
			this.mainCharacter.render();
			this.monster.render();
			this.lastTime = now;
			this.animation = requestAnimationFrame(() => this.main());
		};

		update(dt) {
			this.mainCharacter.update(dt);
			this.monster.update();
		}

		resizeCanvas() {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
		}
	}

	document.addEventListener('DOMContentLoaded', function () {
		document.getElementById('start-game').addEventListener('click', () => {
			let userName =document.forms['user-information'].elements['first-name'].value;
			if (userName) {
				let canvas = document.createElement('canvas');
				document.body.appendChild(canvas);
				canvas.id = 'canvas';
				document.getElementById('greeting').remove();
				let gameField = new GameField(userName);
			}
			else {
				let emptyName = document.getElementsByClassName('empty-name-hidden')[0];
				if (emptyName) {
					emptyName.classList.remove('empty-name-hidden');
					emptyName.classList.add('empty-name');
				}
			}
		});
	})

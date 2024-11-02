// Canvas setup and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Inventory panel and items list elements
const inventoryPanel = document.getElementById('inventoryPanel');
const inventoryItemsList = document.getElementById('inventoryItems');
const equipButtonSlipper = document.getElementById('equipButtonSlipper');
const equipButtonBottle = document.getElementById('equipButtonBottle');
const shopButton = document.getElementById('shopButton');

// Player image setup
const playerImage = new Image();
playerImage.src = "https://assets.onecompiler.app/42wswghpg/42wv9ajwg/image_2024-11-01_162704710.png";

// Slipper image setup
const slipperImage = new Image();
slipperImage.src = "https://assets.onecompiler.app/42wswghpg/42wv9ajwg/file.png"; // Slipper image URL

// Bottle image setup
const bottleImage = new Image();
bottleImage.src = "https://assets.onecompiler.app/42wswghpg/42wv9ajwg/image_2024-11-01_210214474.png"; // Bottle image URL

// Player properties
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 40,
    height: 40,
    speed: 2
};

// Key press tracking
const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
};

// House image setup
const houseImage = new Image();
houseImage.src = "https://assets.onecompiler.app/42wswghpg/42wv9ajwg/image_2024-11-01_161736155.png";

// Square image setup for house area
const squareImage = new Image();
squareImage.src = "https://assets.onecompiler.app/42wswghpg/42wv9ajwg/image_2024-11-01_163043863.png";

// House properties
const house = {
    x: canvas.width - 100,
    y: 10,
    width: 80,
    height: 80
};

// Square position and properties within the house
const square = {
    x: house.x + 10,
    y: house.y + 30,
    width: 60,
    height: 40,
    collided: false, // Flag for collision
    velocity: { x: 0, y: 0 }, // Velocity for the square
    friction: 0.98 // Friction factor to slow down the square
};

// Area states
let currentArea = "Outside";
const exitBox = {
    x: (canvas.width / 2) - 40,
    y: canvas.height - 60,
    width: 80,
    height: 40
};

// Beach entrance properties
const beachEntrance = {
    x: 20,
    y: canvas.height / 2 - 20,
    width: 40,
    height: 40
};

// Beach exit properties (similar to house exit)
const beachExit = {
    x: (canvas.width / 2) - 40, // Same as exitBox
    y: canvas.height - 60,
    width: 80,
    height: 40
};

// Weapon image setup for the beach area
const weaponImage = new Image();
weaponImage.src = "https://assets.onecompiler.app/42wswghpg/42wv9ajwg/file.png"; // Same image for the weapon

// Weapon properties within the yellow (sand) area of the beach
const weapon = {
    x: (3 * canvas.width) / 4,  // Position on the yellow side of the beach
    y: canvas.height / 2,
    width: 40,
    height: 40
};

// Inventory management
let inventory = [];
let equippedWeapon = null;
let coins = 0; // Coin counter
let canHitSquare = true; // Cooldown flag for hitting the square

// Slipper pickup properties
const slipperPickup = {
    x: house.x + 20, // Position of the slipper in the house
    y: house.y + 10,
    width: 40,
    height: 40
};

// Shop panel setup
const shopPanel = document.createElement('div');
const shopItemsList = document.createElement('ul');
const buyBottleButton = document.createElement('button');

shopPanel.id = 'shopPanel';
buyBottleButton.textContent = "Buy Bottle (10 Coins)";
shopPanel.appendChild(shopItemsList);
shopPanel.appendChild(buyBottleButton);
document.body.appendChild(shopPanel);

// Toggle equip/unequip slipper
function toggleEquipSlipper() {
    if (equippedWeapon === "Slipper") {
        equippedWeapon = null; // Unequip slipper
        equipButtonSlipper.textContent = "Equip Slipper";
    } else if (inventory.includes("Slipper")) {
        equippedWeapon = "Slipper"; // Equip slipper
        equipButtonSlipper.textContent = "Unequip Slipper";
    }
    updateInventoryDisplay(); // Update inventory display
}

// Toggle equip/unequip bottle
function toggleEquipBottle() {
    if (equippedWeapon === "Bottle") {
        equippedWeapon = null; // Unequip bottle
        equipButtonBottle.textContent = "Equip Bottle";
    } else if (inventory.includes("Bottle")) {
        equippedWeapon = "Bottle"; // Equip bottle
        equipButtonBottle.textContent = "Unequip Bottle";
    }
    updateInventoryDisplay(); // Update inventory display
}

// Add item to inventory
function addToInventory(item) {
    if (!inventory.includes(item)) {
        inventory.push(item);
        updateInventoryDisplay();
    }
}

// Update inventory display
function updateInventoryDisplay() {
    inventoryItemsList.innerHTML = '';
    inventory.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        inventoryItemsList.appendChild(li);
    });
    inventoryPanel.style.display = inventory.length > 0 ? 'block' : 'none';
}

// Open shop functionality
shopButton.addEventListener('click', () => {
    shopPanel.style.display = shopPanel.style.display === 'none' ? 'block' : 'none';
    updateShopDisplay();
});

// Update shop display
function updateShopDisplay() {
    shopItemsList.innerHTML = '';
    const li = document.createElement('li');
    li.textContent = "Bottle - 10 Coins";
    shopItemsList.appendChild(li);
}

// Buy bottle functionality
buyBottleButton.addEventListener('click', () => {
    if (coins >= 10) {
        coins -= 10; // Deduct coins
        addToInventory("Bottle"); // Add bottle to inventory
        updateInventoryDisplay();
        updateShopDisplay(); // Refresh shop display
        console.log(`Coins: ${coins}`); // Display coins in console
    } else {
        alert("Not enough coins to buy the Bottle!");
    }
});

// Game loop
function update() {
    // Movement logic
    if (keys.w && player.y > 0) player.y -= player.speed;
    if (keys.s && player.y < canvas.height - player.height) player.y += player.speed;
    if (keys.a && player.x > 0) player.x -= player.speed;
    if (keys.d && player.x < canvas.width - player.width) player.x += player.speed;

    // Collision detection with house
    if (player.x < house.x + house.width &&
        player.x + player.width > house.x &&
        player.y < house.y + house.height &&
        player.y + player.height > house.y) {
        currentArea = "House";
    }

    // Collision detection with exit box (exiting house)
    if (currentArea === "House" &&
        player.x < exitBox.x + exitBox.width &&
        player.x + player.width > exitBox.x &&
        player.y < exitBox.y + exitBox.height &&
        player.y + player.height > exitBox.y) {
        currentArea = "Outside";
    }

    // Collision detection with beach entrance
    if (currentArea === "Outside" &&
        player.x < beachEntrance.x + beachEntrance.width &&
        player.x + player.width > beachEntrance.x &&
        player.y < beachEntrance.y + beachEntrance.height &&
        player.y + player.height > beachEntrance.y) {
        currentArea = "Beach"; // Enter the beach
    }

    // Collision detection with beach exit (same as house exit)
    if (currentArea === "Beach" &&
        player.x < beachExit.x + beachExit.width &&
        player.x + player.width > beachExit.x &&
        player.y < beachExit.y + beachExit.height &&
        player.y + player.height > beachExit.y) {
        currentArea = "Outside"; // Exit the beach
    }

    // Collision detection with the square
    if (currentArea === "House" &&
        player.x < square.x + square.width &&
        player.x + player.width > square.x &&
        player.y < square.y + square.height &&
        player.y + player.height > square.y) {
        if (canHitSquare) {
            // Calculate the coin reward based on equipped weapon
            let coinReward = 5; // Base coin amount
            if (equippedWeapon === "Slipper") {
                coinReward *= 1.5; // 1.5x multiplier for slipper
            } else if (equippedWeapon === "Bottle") {
                coinReward *= 2; // 2x multiplier for bottle
            }
            coins += Math.floor(coinReward); // Update coins with reward
            console.log(`Coins: ${coins}`); // Display coins in console

            // Push square away from player
            const hitDirectionX = (player.x + player.width / 2) - (square.x + square.width / 2);
            const hitDirectionY = (player.y + player.height / 2) - (square.y + square.height / 2);
            const magnitude = Math.sqrt(hitDirectionX * hitDirectionX + hitDirectionY * hitDirectionY);
            if (magnitude !== 0) {
                square.velocity.x = (hitDirectionX / magnitude) * 5; // Set velocity in the x direction
                square.velocity.y = (hitDirectionY / magnitude) * 5; // Set velocity in the y direction
            }

            canHitSquare = false; // Start cooldown
            setTimeout(() => {
                canHitSquare = true; // Reset cooldown after 1 second
            }, 1000);
        }
    }

    // Collision detection with slipper pickup
    if (currentArea === "House" &&
        player.x < slipperPickup.x + slipperPickup.width &&
        player.x + player.width > slipperPickup.x &&
        player.y < slipperPickup.y + slipperPickup.height &&
        player.y + player.height > slipperPickup.y) {
        addToInventory("Slipper"); // Add slipper to inventory
        slipperPickup.x = -100; // Move slipper off-screen after pickup
    }

    // Update square position based on velocity
    square.x += square.velocity.x;
    square.y += square.velocity.y;

    // Apply friction to the square's movement
    square.velocity.x *= square.friction;
    square.velocity.y *= square.friction;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the current area
    if (currentArea === "House") {
        ctx.drawImage(houseImage, house.x, house.y, house.width, house.height);
        ctx.drawImage(squareImage, square.x, square.y, square.width, square.height);
        ctx.drawImage(slipperImage, slipperPickup.x, slipperPickup.y, slipperPickup.width, slipperPickup.height); // Draw slipper
    } else if (currentArea === "Beach") {
        // Draw beach area (for simplicity, just a colored rectangle here)
        ctx.fillStyle = "lightblue"; // Beach color
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(weaponImage, weapon.x, weapon.y, weapon.width, weapon.height);
    } else {
        // Draw outside area
        ctx.fillStyle = "lightgreen"; // Outside color
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw player
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    
    // Draw coins display (optional)
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`Coins: ${coins}`, 10, 20); // Display coins at the top left

    // Call the next frame
    requestAnimationFrame(update);
}

// Key event listeners
window.addEventListener('keydown', (e) => {
    if (e.key === 'w') keys.w = true;
    if (e.key === 'a') keys.a = true;
    if (e.key === 's') keys.s = true;
    if (e.key === 'd') keys.d = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'w') keys.w = false;
    if (e.key === 'a') keys.a = false;
    if (e.key === 's') keys.s = false;
    if (e.key === 'd') keys.d = false;
});

// Button event listeners
equipButtonSlipper.addEventListener('click', toggleEquipSlipper);
equipButtonBottle.addEventListener('click', toggleEquipBottle);

// Start the game loop
update();

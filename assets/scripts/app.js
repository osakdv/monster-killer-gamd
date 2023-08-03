const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 20;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

// NOTE: both the monster and the player share the same life value but recorded different to monitor the damageDealth done to them in order to write out other function for them
let chosenMaxLife = parseInt(
  prompt("Maximum life for you and monster.", "100")
);
if (isNaN(chosenMaxLife) || chosenMaxLife <= 0 || !chosenMaxLife) {
  chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let battleLog;
let isBonusLifeUsed = false;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, finalPlayerHealth) {
  let logEntry = {
    event: event,
    value: value,
    monsterHealth: monsterHealth,
    finalPlayerHealth: finalPlayerHealth,
  };

  if (event === LOG_EVENT_PLAYER_ATTACK) {
    logEntry.target = "Monster";
  } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry.target = "Monster";
  } else if (event === LOG_EVENT_MONSTER_ATTACK) {
    logEntry.target = "Player";
  } else if (event === LOG_EVENT_PLAYER_HEAL) {
    logEntry.target = "";
  } else if (event === LOG_EVENT_GAME_OVER) {
    logEntry.target = "";
  }
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth,
    "Player"
  );

  if (currentPlayerHealth <= 0 && !isBonusLifeUsed) {
    increasePlayerHealth(initialPlayerHealth);
    currentPlayerHealth += initialPlayerHealth;
    removeBonusLife();
    isBonusLifeUsed = true;
    writeToLog(
      LOG_EVENT_PLAYER_HEAL,
      initialPlayerHealth,
      currentMonsterHealth,
      currentPlayerHealth,
      "Player healed"
    );
    alert("Bonus life given");
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("Player won!");
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("Player lost");
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("Draw");
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    writeToLog(
      LOG_EVENT_GAME_OVER,
      initialPlayerHealth,
      currentMonsterHealth,
      currentPlayerHealth,
      "Game over"
    );
    reset();
  }
}

function attackMonster(mode) {
  let maxDamage;
  if (mode === MODE_ATTACK) {
    maxDamage = ATTACK_VALUE;
  } else if (mode === MODE_STRONG_ATTACK) {
    maxDamage = STRONG_ATTACK_VALUE;
  }

  const monsterDamage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= monsterDamage;

  writeToLog(
    mode,
    initialPlayerHealth,
    currentMonsterHealth,
    currentPlayerHealth,
    "Monster"
  );
}

function attackHandler() {
  attackMonster("ATTACK");
  endRound();
}

function strongAttackHandler() {
  attackMonster("STRONG_ATTACK");
  endRound();
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't heal to more than your max initial health.");
    healValue = chosenMaxLife - currentMonsterHealth;
  } else {
    healValue = HEAL_VALUE;
  }

  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  endRound();
}

function printLogHandler() {}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);

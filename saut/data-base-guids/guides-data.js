// data/guides.js
window.GUIDES_DATA = {
  // === МАГИЯ ===
  thaumcraft: {
    title: "Thaumcraft",
    aliases: ["таумкрафт", "thaumcraft", "таум", "лолитаумкрафт"],
    page: "pages/guide-bee/magic.html",
    sections: {
      "arcane-table": {
        title: "Магический верстак",
        content: "Используется для создания зачарованных предметов и инструментов. Требует очки исследования и редкие ингредиенты.",
        image: "assets/images/thaumcraft/arcane-table.png",
        imagePos: "top"
      },
      "crucible": {
        title: "Плавильный котёл",
        content: "Позволяет плавить предметы в висс или другие субстанции. Ускоряется с помощью огня или маны.",
        image: "assets/images/thaumcraft/crucible.png",
        imagePos: "left"
      }
    }
  },
  botania: {
    title: "Botania",
    aliases: ["ботания", "botania", "цветы", "лолиботания"],
    page: "pages/guides/magic.html",
    sections: {
      "mana-pool": {
        title: "Бассейн маны",
        content: "Хранилище маны. Может быть расширен с помощью кристаллов. Питает цветы и механизмы.",
        image: "assets/images/botania/mana-pool.png",
        imagePos: "top"
      },
      "lexicon-botania": {
        title: "Лексикон Ботании",
        content: "Основная книга гайда. Содержит рецепты, описание цветов и мануальных механизмов.",
        image: "assets/images/botania/lexicon.png",
        imagePos: "left"
      }
    }
  },
  blood: {
    title: "Blood Magic",
    aliases: ["блудмэджик", "blood magic", "кровь", "лоликровь"],
    page: "pages/guides/magic.html",
    sections: {
      "blood-altar": {
        title: "Алтарь крови",
        content: "Центральный механизм мода. Позволяет обменивать кровь игрока на магические предметы.",
        image: "assets/images/blood/blood-altar.png",
        imagePos: "top"
      }
    }
  },
  lolimagically: {
    title: "LoliMagically",
    aliases: ["лолимаджикали", "lolimagically", "лолимагия"],
    page: "pages/guides/magic.html",
    sections: {
      "runic-matrix": {
        title: "Руническая матрица",
        content: "Позволяет улучшать предметы с помощью рун. Требует ману и редкие кристаллы.",
        image: "assets/images/lolimagically/runic-matrix.png",
        imagePos: "left"
      }
    }
  },

  // === ТЕХНОЛОГИИ ===
  ic2: {
    title: "IndustrialCraft 2",
    aliases: ["ик2", "ic2", "индакрафт", "лолиик2"],
    page: "pages/guides/tech.html",
    sections: {
      "electric-furnace": {
        title: "Электропечь",
        content: "Ускоренная печь, работающая от EU. Может быть улучшена до индустриальной.",
        image: "assets/images/ic2/electric-furnace.png",
        imagePos: "left"
      }
    }
  },
  thermal: {
    title: "Thermal Expansion",
    aliases: ["термал", "thermal", "тепловое расширение", "лолитермал"],
    page: "pages/guides/tech.html",
    sections: {
      "induction-smelter": {
        title: "Индукционная плавильня",
        content: "Позволяет плавить руды в сплавы. Требует энергию и охлаждение.",
        image: "assets/images/thermal/induction-smelter.png",
        imagePos: "top"
      }
    }
  },
  appliedenergistics2: {
    title: "Applied Energistics 2",
    aliases: ["ae2", "энергетика", "лолиэнергетика"],
    page: "pages/guides/tech.html",
    sections: {
      "me-terminal": {
        title: "ME-терминал",
        content: "Доступ к системе хранения. Позволяет искать, извлекать и вставлять предметы.",
        image: "assets/images/ae2/me-terminal.png",
        imagePos: "left"
      }
    }
  },

  // === ИЗМЕРЕНИЯ ===
  galactic: {
    title: "Galacticraft",
    aliases: ["галактик", "galacticraft", "космос", "лоликосмос"],
    page: "../../pages/guids-galacticraft/guids-galacticraft.html",
    sections: {
      "mars": {
        title: "Ракета",
        content: "Позволяет путешествовать по планетам. Требует топливо, кислород и сборку на площадке.",
        image: "assets/images/galactic/rocket.png",
        imagePos: "top"
      }
    }
  },
  twilight: {
    title: "Twilight Forest",
    aliases: ["сумеречный лес", "twilight", "лолисумеречный"],
    page: "pages/guides/dimensions.html",
    sections: {
      "portal": {
        title: "Портал в Сумеречный лес",
        content: "Создаётся с помощью алмазов и воды. Ведёт в измерение с боссами и редкими локациями.",
        image: "assets/images/twilight/portal.png",
        imagePos: "left"
      }
    }
  },

  // === ПЧЕЛОВОДСТВО ===
  forestry: {
    title: "Forestry",
    aliases: ["форестри", "forestry", "пчёлы", "лолифорестри"],
    page: "pages/guides/bees.html",
    sections: {
      "apiary": {
        title: "Пасека",
        content: "Базовый механизм для разведения пчёл. Требует цветы и пространство.",
        image: "assets/images/forestry/apiary.png",
        imagePos: "left"
      },
      "alveary": {
        title: "Ульи",
        content: "Улучшенная пасека. Позволяет ускорять разведение и добавлять модули.",
        image: "assets/images/forestry/alveary.png",
        imagePos: "top"
      }
    }
  },

  // === ПИТАНИЕ ===
  pam: {
    title: "Pam's HarvestCraft",
    aliases: ["пэм", "pam", "еда", "лолипэм"],
    page: "pages/guides/food.html",
    sections: {
      "garden": {
        title: "Сад",
        content: "Позволяет выращивать сотни видов растений. Требует семена и воду.",
        image: "assets/images/pam/garden.png",
        imagePos: "left"
      }
    }
  },

  // === ПРОЧЕЕ ===
  lolidimensions: {
    title: "LoliDimensions",
    aliases: ["лолиизмерения", "lolidimensions", "измерения"],
    page: "pages/guides/other.html",
    sections: {
      "dimensional-key": {
        title: "Ключ измерений",
        content: "Позволяет создавать порталы в пользовательские измерения.",
        image: "assets/images/lolidimensions/key.png",
        imagePos: "top"
      }
    }
  }
};
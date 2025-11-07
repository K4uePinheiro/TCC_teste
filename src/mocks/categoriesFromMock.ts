export interface Category {
  id: number;
  name: string;
  subCategories?: Category[]; // 👈 opcional — evita conflito de tipo
}

// 🔹 Exemplo de mock (você pode adaptar ao seu JSON real)
export const categoriesFromMock: Category[] = [
     {
        id: 1,
        name: "Eletrônicos",
        subCategories: [
          {
            id: 4,
            name: "Celulares",
            subCategories: [
              {
                id: 5,
                name: "Smartphones",
                subCategories: [],
              },
            ],
          },
        ],
      },
      {
        id: 1,
        name: "Eletrônicos",
        subCategories: [
          {
            id: 4,
            name: "Celulares",
            subCategories: [
              {
                id: 5,
                name: "Smartphones",
                subCategories: [],
              },
            ],
          },
        ],
      },
      {
        id: 1,
        name: "Eletrônicos",
        subCategories: [
          {
            id: 6,
            name: "Acessórios",
            subCategories: [
              {
                id: 7,
                name: "Fones de Ouvido",
                subCategories: [],
              },
            ],
          },
        ],
      },
]
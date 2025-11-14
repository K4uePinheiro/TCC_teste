export interface Category {
  id: number;
  name: string;
  subCategories: Category[];
}

export interface ProductMock {
  id: number;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  stock?: number;
  discount: number;
  imgUrl: string;
  categories: Category[];
  seller?: string;
  images?: string[];
}

// exemplo de mock
export const productsMock: ProductMock[] = [
  {
    id: 1,
    name: "Notebook Gamer",
    price: 4500.0, // adiciona oldPrice
    discount: 10.0,
    imgUrl: "https://m.media-amazon.com/images/I/51Wv-tEUn6L._AC_SX679_.jpg",
    categories: [
      {
        id: 1,
        name: "Eletrônicos",
        subCategories: [
          {
            id: 2,
            name: "Computadores",
            subCategories: [
              {
                id: 3,
                name: "Notebooks",
                subCategories: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Smartphone X",
    description: "Smartphone moderno com câmera avançada e alto desempenho",
    price: 2200.0,
    discount: 12.0,
    imgUrl:
      "https://d3qoj2c6mu9s8x.cloudfront.net/Custom/Content/Products/40/06/4006975_smartphone-apple-iphone-x-5-8-camera-12mp-dual-frontal-7mp-com-ios-11-prata-256gb_m2_637223855454369999.webp",
    categories: [
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
    ],
  },
  {
    id: 3,
    name: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com bateria de longa duração",
    price: 150.0,
    discount: 25.0,
    imgUrl: "https://m.media-amazon.com/images/I/51olNZRjn+L._AC_SY300_SX300_.jpg",
    categories: [
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
    ],
  },
  {
    id: 4,
    name: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com bateria de longa duração",
    price: 150.0,
    discount: 25.0,
    imgUrl: "https://m.media-amazon.com/images/I/51olNZRjn+L._AC_SY300_SX300_.jpg",
    categories: [
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
    ],
  },
  {
    id: 5,
    name: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com bateria de longa duração",
    price: 150.0,
    discount: 25.0,
    imgUrl: "https://m.media-amazon.com/images/I/51olNZRjn+L._AC_SY300_SX300_.jpg",
    categories: [
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
    ],
  },
  {
    id: 6,
    name: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com bateria de longa duração",
    price: 150.0,
    discount: 25.0,
    imgUrl: "https://m.media-amazon.com/images/I/51olNZRjn+L._AC_SY300_SX300_.jpg",
    categories: [
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
    ],
  },
  {
    id: 7,
    name: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com bateria de longa duração",
    price: 150.0,
    discount: 25.0,
    imgUrl: "https://m.media-amazon.com/images/I/51olNZRjn+L._AC_SY300_SX300_.jpg",
    categories: [
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
    ],
  },
  {
    id: 8,
    name: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com bateria de longa duração",
    price: 150.0,
    discount: 25.0,
    imgUrl: "https://m.media-amazon.com/images/I/51olNZRjn+L._AC_SY300_SX300_.jpg",
    categories: [
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
    ],
  },
  {
    id: 9,
    name: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com bateria de longa duração",
    price: 150.0,
    discount: 25.0,
    imgUrl: "https://m.media-amazon.com/images/I/51olNZRjn+L._AC_SY300_SX300_.jpg",
    categories: [
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
    ],
  },
  {
    id: 10,
    name: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com bateria de longa duração",
    price: 150.0,
    discount: 25.0,
    imgUrl: "https://m.media-amazon.com/images/I/51olNZRjn+L._AC_SY300_SX300_.jpg",
    categories: [
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
    ],
  },
  {
    id: 11,
    name: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com bateria de longa duração",
    price: 150.0,
    discount: 25.0,
    imgUrl: "https://m.media-amazon.com/images/I/51olNZRjn+L._AC_SY300_SX300_.jpg",
    categories: [
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
    ],
  },
  {
    id: 12,
    name: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com bateria de longa duração",
    price: 150.0,
    discount: 25.0,
    imgUrl: "https://m.media-amazon.com/images/I/51olNZRjn+L._AC_SY300_SX300_.jpg",
    categories: [
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
    ],
  },
  {
    id: 13,
    name: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com bateria de longa duração",
    price: 150.0,
    discount: 25.0,
    imgUrl: "https://m.media-amazon.com/images/I/51olNZRjn+L._AC_SY300_SX300_.jpg",
    categories: [
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
    ],
  },
  {
    id: 14,
    name: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com bateria de longa duração",
    price: 150.0,
    discount: 25.0,
    imgUrl: "https://m.media-amazon.com/images/I/51olNZRjn+L._AC_SY300_SX300_.jpg",
    categories: [
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
    ],
  },
  {
    id: 15,
    name: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com bateria de longa duração",
    price: 150.0,
    discount: 25.0,
    imgUrl: "https://m.media-amazon.com/images/I/51olNZRjn+L._AC_SY300_SX300_.jpg",
    categories: [
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
    ],
  },
  {
    id: 16,
    name: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com bateria de longa duração",
    price: 150.0,
    discount: 25.0,
    imgUrl: "https://m.media-amazon.com/images/I/51olNZRjn+L._AC_SY300_SX300_.jpg",
    categories: [
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
    ],
  },
  {
    id: 17,
    name: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com bateria de longa duração",
    price: 150.0,
    discount: 25.0,
    imgUrl: "https://m.media-amazon.com/images/I/51olNZRjn+L._AC_SY300_SX300_.jpg",
    categories: [
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
    ],
  },
  {
    id: 18,
    name: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com bateria de longa duração",
    price: 150.0,
    discount: 25.0,
    imgUrl: "https://m.media-amazon.com/images/I/51olNZRjn+L._AC_SY300_SX300_.jpg",
    categories: [
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
    ],
  },
  {
    id: 19,
    name: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com bateria de longa duração",
    price: 150.0,
    discount: 25.0,
    imgUrl: "https://m.media-amazon.com/images/I/51olNZRjn+L._AC_SY300_SX300_.jpg",
    categories: [
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
    ],
  },
  {
    id: 20,
    name: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com bateria de longa duração",
    price: 150.0,
    discount: 25.0,
    imgUrl: "https://m.media-amazon.com/images/I/51olNZRjn+L._AC_SY300_SX300_.jpg",
    categories: [
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
    ],
  },
  {
    id: 21,
    name: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com bateria de longa duração",
    price: 150.0,
    discount: 25.0,
    imgUrl: "https://m.media-amazon.com/images/I/51olNZRjn+L._AC_SY300_SX300_.jpg",
    categories: [
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
    ],
  },
];

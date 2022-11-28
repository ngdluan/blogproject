export const eventFindAllSuccess = {
  count: 2,
  result: [
    {
      id: 'cbf4f07e-686d-4b8e-93f0-dacf796b3535',
      name: 'hehe',
      where: 'dau do',
      when: '2022-11-25T09:47:51.531Z',
      link: null,
      Address: [],
      User: [],
      Group: [],
    },
    {
      id: '26d21a02-dafb-4ad1-870d-e334eb1130ad',
      name: 'string',
      where: 'string',
      when: '2022-11-25T09:59:21.611Z',
      link: null,
      Address: [],
      User: [],
      Group: [],
    },
  ],
};

export const eventFindOneSuccess = {
  id: 'cbf4f07e-686d-4b8e-93f0-dacf796b3535',
  name: 'hehe',
  where: 'dau do',
  when: '2022-11-25T09:47:51.531Z',
  link: null,
  Address: [],
  User: [],
  Group: [],
};

export const findOneFail = {
  statusCode: 404,
  message: 'Not Found',
};

// Posts
export const postFindAllSuccess = {
  count: 1,
  result: [
    {
      id: '5e26aeb4-5343-40fa-9514-3826eb5bddab',
      title: 'Hello World',
      description: 'Hello World',
      content: 'Hello World',
      comments: [],
      category: [],
      author: {
        id: '7bde674b-0650-4258-b05f-f3bb0ba24a0a',
        name: 'Eric',
        email: 'eric@gmail.com',
      },
    },
  ],
};

export const postFindOneSuccess = {
  id: '5e26aeb4-5343-40fa-9514-3826eb5bddab',
  title: 'Hello World',
  description: 'Hello World',
  content: 'Hello World',
  comments: [],
  category: [],
  author: {
    id: '7bde674b-0650-4258-b05f-f3bb0ba24a0a',
    name: 'Eric',
    email: 'eric@gmail.com',
  },
};

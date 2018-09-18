export default [
  {
    min: 0,
    max: 51,
    level: '0 – 50',
    status: 'Tốt',
    description: 'Không ảnh hưởng đến sức khỏe',
    color: '#00A065'
  },
  {
    min: 51,
    max: 101,
    level: '51 – 100',
    status: 'Trung bình',
    description: 'Nhóm nhạy cảm nên hạn chế thời gian ở bên ngoài',
    color: '#FFEB3B'
  },
  {
    min: 101,
    max: 201,
    level: '101 – 200',
    status: 'Kém',
    description: 'Nhóm nhạy cảm cần hạn chế thời gian ở bên ngoài',
    color: '#FF9400'
  },
  {
    min: 201,
    max: 301,
    level: '201 – 300',
    status: 'Xấu',
    description:
      'Nhóm nhạy cảm tránh ra ngoài. Những người khác hạn chế ở bên ngoài',
    color: '#F44336'
  },
  {
    min: 300,
    max: 999999999,
    level: 'Trên 300',
    status: 'Nguy hại',
    description: 'Mọi người nên ở trong nhà',
    color: '#795548'
  }
]

import { City } from "../entities/city";

type CitySeeder = {
  name: string
  description: string
}

const cities: Record<string, CitySeeder> = {
  vegas: {
    name: 'Las Vegas',
    description: 'Low poverity level, high prostitute income, high drug trade, low hitman contracts, medium robbery rewards, high heat increase',
  },
  'new-york': {
    name: 'New York City',
    description: 'Low poverty level, medium prostitute income, medium drug trade, high hitman contracts, high robbery rewards, very high heat increase',
  },
  detroit: {
    name: 'Detroit',
    description: 'High poverty level, low prostitute income, high drug trade, low hitman contracts, low robbery rewards, very low heat increase',
  },
  chicago: {
    name: 'Chicago',
    description: 'Medium poverty level, low prostitute income, medium drug trade, medium hitman contracts, high robbery rewards, medium heat increase',
  },
}

export default async function seed() {
  for (const shortName in cities) {
    const city = (await City.findOne({shortName})) || City.create({shortName})
    city.name = cities[shortName].name
    city.description = cities[shortName].description
    try {

      await city.save()
    } catch (e) {
      console.log('city', e)
    }
  }
}

import dogImage from "@/assets/img/dog.jpg"
import catImage from "@/assets/img/cat.jpg"
import groomingImage from "@/assets/img/grooming.jpg"
import toysImage from "@/assets/img/toys.jpg"
import accessoriesImage from "@/assets/img/accessories.jpg"
import beddingImage from "@/assets/img/bed.jpg"

export const categoryImages = [
  dogImage,
  catImage,
  groomingImage,
  toysImage,
  accessoriesImage,
  beddingImage,
]

export function getCategoryImage(index: number) {
  return categoryImages[index % categoryImages.length]
}

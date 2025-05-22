import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAllProducts(): Promise<{
    products: (Product & { categoryName: string | null })[];
  }> {
    const products = await this.prisma.product.findMany({
      where: { isDeleted: false },
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    const formattedProducts = products.map((product) => ({
      ...product,
      categoryName: product?.category.name || null,
    }));

    return { products: formattedProducts };
  }

  async findOneProduct(productId: string): Promise<Product> {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, isDeleted: false },
    });

    if (!product) {
      throw new NotFoundException('Product does not exists');
    }

    return product;
  }

  async createProduct(data: CreateProductDto) {
    console.log(data);
    const { name, description, categoryId } = data;

    const productExist = await this.prisma.product.findFirst({
      where: { isDeleted: false, name },
    });

    if (productExist) {
      throw new BadRequestException('Product with this name already exists');
    }

    const product = await this.prisma.product.create({
      data: { name, description, categoryId },
    });

    return product;
  }

  async updateProduct(
    productId: string,
    data: UpdateProductDto,
  ): Promise<Product> {
    const { name, description, basePrice, categoryId } = data;

    const product = await this.prisma.product.findFirst({
      where: { isDeleted: false, id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product does not exists');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: {
        name: name ?? product.name,
        description: description ?? product.description,
        basePrice: basePrice ?? product.basePrice,
        categoryId: categoryId ?? product.categoryId,
      },
    });

    return updatedProduct;
  }

  async deleteProduct(productId: string) {
    const productExist = await this.prisma.product.findFirst({
      where: { isDeleted: false, id: productId },
    });

    if (!productExist) {
      throw new NotFoundException('Product does not exists');
    }

    await this.prisma.product.update({
      where: { isDeleted: false, id: productId },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    return { message: 'Product deleted successfully' };
  }
}

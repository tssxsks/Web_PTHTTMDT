import Order from '../models/orderModel.js';

class RevenueService {
    /**
     * Lấy doanh thu theo ngày
     * @param {Date} startDate - Ngày bắt đầu
     * @param {Date} endDate - Ngày kết thúc
     */
    static async getRevenueByDay(startDate, endDate) {
        try {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            const revenue = await Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: start, $lte: end },
                        isPaid: true,
                        status: { $ne: 'cancelled' }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        totalRevenue: { $sum: "$totalPrice" },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            return revenue;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Lấy doanh thu theo tháng
     * @param {number} year - Năm cần lấy doanh thu
     */
    static async getRevenueByMonth(year) {
        try {
            const start = new Date(year, 0, 1);
            const end = new Date(year, 11, 31, 23, 59, 59);

            const revenue = await Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: start, $lte: end },
                        isPaid: true,
                        status: { $ne: 'cancelled' }
                    }
                },
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        totalRevenue: { $sum: "$totalPrice" },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            return revenue;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Lấy doanh thu theo sản phẩm
     */
    static async getRevenueByProduct() {
        try {
            const revenue = await Order.aggregate([
                {
                    $match: {
                        isPaid: true,
                        status: { $ne: 'cancelled' }
                    }
                },
                { $unwind: "$items" },
                {
                    $group: {
                        _id: "$items.product",
                        name: { $first: "$items.name" },
                        totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                        totalQuantity: { $sum: "$items.quantity" }
                    }
                },
                { $sort: { totalRevenue: -1 } },
                { $limit: 10 } // Top 10 products
            ]);

            return revenue;
        } catch (error) {
            throw error;
        }
    }
}

export default RevenueService;

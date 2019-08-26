import express from 'express';

const router = express.Router();

router.get('/search', (req, res) => {
	res.json({
		books: [
			{
				goodreadsId: 1,
				title: 'title 1',
				authors: 'Fendy',
				covers: [
					'http://images.gr-assets.com/books/13489905661/5470.jpg',
					'http://images.gr-assets.com/books/13489905661/5470.jpg'
				],
				pages: 168
			},
			{
				goodreadsId: 2,
				title: 'title 2',
				authors: 'Fendy Nugroho',
				covers: [
					'http://images.gr-assets.com/books/13489905661/5470.jpg',
					'http://images.gr-assets.com/books/13489905661/5470.jpg'
				],
				pages: 222
			}
		]
	});
});

export default router;

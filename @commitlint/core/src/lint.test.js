import test from 'ava';
import lint from './lint';

test('throws without params', async t => {
	const error = await t.throws(lint());
	t.is(error.message, 'Expected a raw commit');
});

test('throws with empty message', async t => {
	const error = await t.throws(lint(''));
	t.is(error.message, 'Expected a raw commit');
});

test('positive on stub message and no rule', async t => {
	const actual = await lint('foo: bar');
	t.true(actual.valid);
});

test('positive on stub message and adhered rule', async t => {
	const actual = await lint('foo: bar', {
		'type-enum': [2, 'always', ['foo']]
	});
	t.true(actual.valid);
});

test('negative on stub message and broken rule', async t => {
	const actual = await lint('foo: bar', {
		'type-enum': [2, 'never', ['foo']]
	});
	t.false(actual.valid);
});

test('positive on ignored message and broken rule', async t => {
	const actual = await lint('Revert "some bogus commit"', {
		'type-empty': [2, 'never']
	});
	t.true(actual.valid);
});

test('positive on stub message and opts', async t => {
	const actual = await lint(
		'foo-bar',
		{
			'type-enum': [2, 'always', ['foo']],
			'type-empty': [2, 'never']
		},
		{
			parserOpts: {
				headerPattern: /^(\w*)(?:\((.*)\))?-(.*)$/
			}
		}
	);
	t.true(actual.valid);
});

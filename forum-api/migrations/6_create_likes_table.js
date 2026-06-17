exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    comment_id: { type: 'VARCHAR(50)', notNull: true, references: '"comments"', onDelete: 'CASCADE' },
    user_id: { type: 'VARCHAR(50)', notNull: true, references: '"users"', onDelete: 'CASCADE' },
  });
  pgm.addConstraint('likes', 'unique_comment_user', 'UNIQUE(comment_id, user_id)');
};

exports.down = (pgm) => {
  pgm.dropTable('likes');
};
